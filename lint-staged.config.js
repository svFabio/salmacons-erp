export default {
  'backend/src/**/*.ts': [
    () => 'pnpm --dir backend run lint',
  ],
  'frontend/src/**/*.ts': [
    () => 'pnpm --dir frontend run lint',
  ],
  '*.{json,md,yaml,yml}': ['npx prettier --write'],
};
