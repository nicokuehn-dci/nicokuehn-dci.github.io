/**
 * Minimal ESLint flat config to avoid the "couldn't find eslint.config" message.
 * This file intentionally provides a tiny config; expand it later to add rules/plugins.
 */
module.exports = {
  ignores: ['node_modules', 'dist', 'build'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  // minimal ruleset; keep empty so eslint runs without errors
  rules: {},
};
