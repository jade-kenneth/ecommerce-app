const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const files = [
  path.join(rootDir, 'android', 'app', 'build.gradle'),
  path.join(
    rootDir,
    'android',
    'capacitor-cordova-android-plugins',
    'build.gradle',
  ),
];

const removeFlatDir = (content) => {
  return content.replace(/\s*flatDir\s*\{[\s\S]*?\}\s*/g, '\n');
};

const ensureFileTreeAar = (content) => {
  return content.replace(
    /fileTree\(([^)]*?)include:\s*\[(.*?)\](.*?)(\)|,)/g,
    (match, before, includes, after, end) => {
      if (includes.includes('*.aar')) return match;
      const cleaned = includes
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      cleaned.push("'*.aar'");
      return `fileTree(${before}include: [${cleaned.join(', ')}]${after}${end}`;
    },
  );
};

const patchFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = removeFlatDir(original);
  updated = ensureFileTreeAar(updated);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
  }
};

files.forEach(patchFile);
