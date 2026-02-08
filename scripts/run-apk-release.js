const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
    ...options,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const readJavaMajor = (env = process.env) => {
  const result = spawnSync('java', ['-version'], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const combined = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();
  return parseJavaMajor(combined);
};

const readJavaMajorFromJavaBin = (javaBin, env) => {
  const result = spawnSync(javaBin, ['-version'], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const combined = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();
  return parseJavaMajor(combined);
};

const parseJavaMajor = (text) => {
  if (!text) return null;
  const match =
    text.match(/version "(\d+)(?:\.(\d+))?/i) ||
    text.match(/openjdk version "(\d+)(?:\.(\d+))?/i);
  if (!match) return null;
  const major = Number(match[1]);
  return Number.isFinite(major) ? major : null;
};

const resolveJavaHome = () => {
  const env = process.env;
  const candidates = [
    env.JAVA_HOME_17,
    env.JAVA_HOME_21,
    env.ANDROID_JAVA_HOME,
    env.ANDROID_STUDIO_JAVA_HOME,
  ].filter(Boolean);

  const isMac = process.platform === 'darwin';
  const isWin = process.platform === 'win32';

  if (isMac) {
    const androidStudioJbr =
      '/Applications/Android Studio.app/Contents/jbr/Contents/Home';
    candidates.push(androidStudioJbr);
    candidates.push(
      '/Applications/Android Studio.app/Contents/jre/Contents/Home',
    );
  }

  if (!isWin) {
    candidates.push('/usr/lib/jvm/java-17-openjdk');
    candidates.push('/usr/lib/jvm/java-17');
    candidates.push('/usr/lib/jvm/jdk-17');
  }

  if (isWin) {
    candidates.push('C:\\\\Program Files\\\\Android\\\\Android Studio\\\\jbr');
    candidates.push('C:\\\\Program Files\\\\Java\\\\jdk-17');
  }

  const scored = [];
  for (const candidate of candidates) {
    if (!candidate || !fs.existsSync(candidate)) continue;
    const javaBin = path.join(candidate, 'bin', 'java');
    if (!fs.existsSync(javaBin)) continue;
    const major = readJavaMajorFromJavaBin(javaBin, {
      ...process.env,
      JAVA_HOME: candidate,
      PATH: `${path.join(candidate, 'bin')}${path.delimiter}${process.env.PATH}`,
    });
    if (major) {
      scored.push({ candidate, major });
    }
  }

  const preferred = scored.find((item) => item.major === 17);
  if (preferred) return preferred.candidate;

  const fallback = scored.find((item) => item.major === 21);
  if (fallback) return fallback.candidate;

  if (scored.length > 0) {
    return scored[0].candidate;
  }

  if (isMac) {
    try {
      const javaHome = execFileSync('/usr/libexec/java_home', ['-v', '17'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })
        .toString()
        .trim();
      if (javaHome && fs.existsSync(javaHome)) {
        return javaHome;
      }
    } catch (error) {
      // ignore
    }
  }

  return null;
};

const ensureSupportedJava = () => {
  const currentMajor = readJavaMajor();
  if (!currentMajor) {
    const resolved = resolveJavaHome();
    if (resolved) {
      const env = { ...process.env, JAVA_HOME: resolved };
      console.log(`Using JAVA_HOME=${resolved}`);
      return { env };
    }
    return { env: process.env };
  }

  if (currentMajor <= 21) {
    return { env: process.env };
  }

  const javaHome = resolveJavaHome();
  if (!javaHome) {
    console.error(
      [
        'Java version is too new for Gradle/Android build (detected ' +
          currentMajor +
          ').',
        'Install JDK 17 and set JAVA_HOME, or set JAVA_HOME_17.',
        'Example (macOS): export JAVA_HOME=$(/usr/libexec/java_home -v 17)',
      ].join('\n'),
    );
    process.exit(1);
  }

  const env = { ...process.env, JAVA_HOME: javaHome };
  console.log(`Using JAVA_HOME=${javaHome}`);
  return { env };
};

const { env } = ensureSupportedJava();

run('npm', ['run', 'android:version:bump'], { cwd: rootDir, env });
run('npm', ['run', 'build:app'], { cwd: rootDir, env });
run('npm', ['run', 'cap:sync'], { cwd: rootDir, env });

const gradleUserHome = path.join(rootDir, '.gradle-cache');
const androidDir = path.join(rootDir, 'android');
const gradleCommand =
  process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

run(gradleCommand, ['assembleRelease'], {
  cwd: androidDir,
  env: {
    ...env,
    GRADLE_USER_HOME: gradleUserHome,
  },
});

const apkPath = path.join(
  androidDir,
  'app',
  'build',
  'outputs',
  'apk',
  'release',
  'app-release.apk',
);

if (fs.existsSync(apkPath)) {
  console.log(`APK ready: ${apkPath}`);
} else {
  console.warn('APK build finished but file not found:', apkPath);
}
