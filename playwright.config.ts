import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: false,
  //retries: 1,
  reporter: [
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    ['allure-playwright'],
    ['html']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://enotes.pointschool.ru',
    headless: false,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 25000
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    }
  ],
});
