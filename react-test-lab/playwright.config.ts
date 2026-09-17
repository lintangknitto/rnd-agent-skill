import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for React Test Lab (Vite + TypeScript).
 * Adapted from webapp-testing skill assets for this project's port and package manager.
 */
// All Playwright output lives under docs/qa/, next to test-matrix.md, so
// everything QA-related for this app is in one place.
const QA_DIR = 'docs/qa'

// Headless in CI, or when HEADLESS=true is set explicitly for an
// unattended/agent-driven local run. Headed otherwise.
const isHeadless = !!process.env.CI || process.env.HEADLESS === 'true'

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: `${QA_DIR}/test-results`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Capped at 3 locally — Playwright's uncapped default (roughly half the
  // CPU cores) can open far more Chrome windows at once than is useful to
  // watch when headed.
  workers: process.env.CI ? 1 : 3,
  reporter: [
    ['list'],
    // Playwright's own report, unmodified — build_report.py only
    // post-processes this afterwards to add video speed controls.
    ['html', { outputFolder: `${QA_DIR}/playwright-report`, open: 'never' }],
    ['json', { outputFile: `${QA_DIR}/playwright-results.json` }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    headless: isHeadless,
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
