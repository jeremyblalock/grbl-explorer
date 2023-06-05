const path = require('path')

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['react', '@typescript-eslint', 'import', 'prettier'],
  extends: [
    'airbnb-typescript/base',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.join(__dirname, './tsconfig.json'),
  },
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/default-param-last': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
  },
}
