import { defineConfig, devices } from '@playwright/test';

// De tests openen de gebouwde app (npm run build) via `vite preview`.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173/calculate-waveforms-claude/',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/calculate-waveforms-claude/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
