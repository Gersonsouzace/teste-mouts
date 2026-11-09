import js from '@eslint/js';
import pluginCypress from 'eslint-plugin-cypress';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/',
      'allure-results/',
      'allure-report/',
      'cypress/screenshots/',
      'cypress/videos/',
    ],
  },
  js.configs.recommended,
  pluginCypress.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-force': 'warn',
      'cypress/no-pause': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      eqeqeq: 'error',
    },
  },
  prettier,
];
