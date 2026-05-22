import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    hookTimeout: 60000,
    setupFiles: ['./src/tests/mongoSetup.js'],
  },
});
