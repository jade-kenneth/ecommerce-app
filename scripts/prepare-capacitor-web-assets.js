const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const webDir = path.join(rootDir, 'dist', 'apps', 'ecommerce-app', '.next');
const rootIndexPath = path.join(webDir, 'index.html');
const rootNotFoundPath = path.join(webDir, '404.html');

const fail = (message) => {
  console.error(`[prepare-capacitor-web-assets] ${message}`);
  process.exit(1);
};

if (!fs.existsSync(webDir)) {
  fail(
    `Web directory not found: ${webDir}. Run "npm run build:app" before syncing Capacitor.`,
  );
}

if (!fs.existsSync(rootIndexPath)) {
  const indexCandidates = [
    path.join(webDir, 'server', 'app', 'index.html'),
    path.join(webDir, 'server', 'pages', 'index.html'),
  ];
  const sourceIndexPath = indexCandidates.find((file) => fs.existsSync(file));

  if (!sourceIndexPath) {
    fail(
      `No index.html source found in Next build output. Checked: ${indexCandidates.join(', ')}`,
    );
  }

  fs.copyFileSync(sourceIndexPath, rootIndexPath);
  console.log(
    `[prepare-capacitor-web-assets] Created ${path.relative(rootDir, rootIndexPath)} from ${path.relative(rootDir, sourceIndexPath)}`,
  );
}

if (!fs.existsSync(rootNotFoundPath)) {
  const notFoundCandidates = [
    path.join(webDir, 'server', 'pages', '404.html'),
    path.join(webDir, 'server', 'app', '_not-found.html'),
  ];
  const sourceNotFoundPath = notFoundCandidates.find((file) =>
    fs.existsSync(file),
  );

  if (sourceNotFoundPath) {
    fs.copyFileSync(sourceNotFoundPath, rootNotFoundPath);
    console.log(
      `[prepare-capacitor-web-assets] Created ${path.relative(rootDir, rootNotFoundPath)} from ${path.relative(rootDir, sourceNotFoundPath)}`,
    );
  }
}

console.log(
  `[prepare-capacitor-web-assets] Web assets are ready for Capacitor sync.`,
);
