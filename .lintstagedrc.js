module.exports = {
  '*.{js,ts,jsx,tsx,mjs,cjs}': 'npm run lint:fix',
  '*.{ts,tsx}': 'npm run typecheck:lintstaged' // flags from tsconfig aren't picked up when files are passed
}
