export default {
  'backend/src/**/*.ts': [
    () => 'cd backend && pnpm run lint',
  ],
  'frontend/src/**/*.ts': [
    () => 'cd frontend && pnpm run lint',
  ],
  '*.{json,md,yaml,yml}': ['prettier --write'],
};
