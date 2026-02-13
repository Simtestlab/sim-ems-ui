import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // This enables 'describe', 'it', 'expect' globally 
    // so you don't always have to import them
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'], // Optional: if you have a setup file
  },
  resolve: {
    alias: {
      // This tells Vitest exactly what '@' means
      '@': path.resolve(__dirname, './src'),
    },
  },
});