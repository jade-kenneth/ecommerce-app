const playwright = require('eslint-plugin-playwright');
const baseConfig = require('../../eslint.config.cjs');

module.exports = [
  ...baseConfig,

  playwright.configs['flat/recommended'],

  {
    files: ['**/*.ts', '**/*.js'],
    // Override or add rules here
    rules: {},
  },
];
