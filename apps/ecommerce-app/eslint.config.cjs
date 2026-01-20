const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const { fixupConfigRules } = require('@eslint/compat');
const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...baseConfig,

  ...fixupConfigRules(compat.extends('next')),

  ...fixupConfigRules(compat.extends('next/core-web-vitals')),

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
