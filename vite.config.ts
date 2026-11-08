/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` moet de naam van de repo zijn, anders laadt de site niet op GitHub Pages.
export default defineConfig({
  base: '/calculate-waveforms-claude/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
