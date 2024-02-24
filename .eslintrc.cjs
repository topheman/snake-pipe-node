module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // eslint-config-prettier
    'plugin:prettier/recommended', // eslint-plugin-prettier
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'bin.js'],
  parser: '@typescript-eslint/parser',
  plugins: [],
  rules: {
    'prettier/prettier': ['error'],
  },
}
