const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');

const content = fs.readFileSync(filePath, 'utf8');

const codeMatch = content.match(/versionCode\s+(\d+)/);
if (!codeMatch) {
  throw new Error('Could not find versionCode in android/app/build.gradle');
}

const nameMatch = content.match(/versionName\s+(['"])([^'"]+)\1/);
if (!nameMatch) {
  throw new Error('Could not find versionName in android/app/build.gradle');
}

const currentCode = Number(codeMatch[1]);
const currentName = nameMatch[2];
const quote = nameMatch[1];

const arg = process.argv[2];
const mode = arg || 'patch';

const bumpVersion = (value, bumpType) => {
  const parts = value.split('.').map((part) => {
    const num = Number(part);
    if (!Number.isFinite(num)) {
      throw new Error(`Invalid versionName segment: "${part}"`);
    }
    return num;
  });

  if (!parts.length) {
    throw new Error('versionName must contain at least one numeric segment.');
  }

  if (bumpType === 'major') {
    parts[0] += 1;
    for (let i = 1; i < parts.length; i += 1) {
      parts[i] = 0;
    }
  } else if (bumpType === 'minor') {
    if (parts.length < 2) parts.push(0);
    parts[1] += 1;
    for (let i = 2; i < parts.length; i += 1) {
      parts[i] = 0;
    }
  } else if (bumpType === 'patch') {
    parts[parts.length - 1] += 1;
  } else {
    throw new Error(
      'Unknown bump type. Use "major", "minor", "patch", or provide a version like "1.2.3".',
    );
  }

  return parts.join('.');
};

let nextName;
if (mode.startsWith('set=')) {
  nextName = mode.slice(4);
} else if (/^\d+(\.\d+)*$/.test(mode)) {
  nextName = mode;
} else {
  nextName = bumpVersion(currentName, mode);
}

const nextCode = currentCode + 1;

let nextContent = content.replace(
  /versionCode\s+\d+/,
  `versionCode ${nextCode}`,
);
nextContent = nextContent.replace(
  /versionName\s+(['"])([^'"]+)\1/,
  `versionName ${quote}${nextName}${quote}`,
);

fs.writeFileSync(filePath, nextContent);

console.log(
  `Android version bumped: versionCode ${currentCode} -> ${nextCode}, versionName "${currentName}" -> "${nextName}"`,
);
