const nextEslintPluginNext = require('@next/eslint-plugin-next');
const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.base.config.cjs');

module.exports = [
  { plugins: { '@next/next': nextEslintPluginNext } },

  ...baseConfig,
  ...nx.configs['flat/react-typescript'],
  {
    ignores: ['.next/**/*'],
    rules: {
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty': 'off',
    },
  },
];
