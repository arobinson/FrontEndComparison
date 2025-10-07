import { TestRunner } from './test-runner.js';
import { TestConfig } from './types.js';
import { join } from 'path';
import * as scenarios from './scenarios/index.js';
import puppeteer from 'puppeteer';

async function main(): Promise<void> {
  console.log('='.repeat(80));
  console.log('HEADED MODE - Filter Test Only (1 repetition)');
  console.log('Browser will be VISIBLE so you can see what happens');
  console.log('='.repeat(80));

  // Launch browser with extra logging
  const browser = await puppeteer.launch({
    headless: 'new', // Use new headless mode (more stable)
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080'],
    dumpio: true // Show browser console output
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('\n📍 Running filter-application scenario...\n');

    const context = {
      page,
      baseUrl: 'http://localhost:4200',
      framework: 'Angular'
    };

    const result = await scenarios.filterApplicationScenario.run(context);

    console.log('\n✅ Test completed successfully!');
    console.log('Measurements:', result.measurements);

    console.log('\nPress Enter to close browser...');
    await new Promise<void>((resolve) => {
      process.stdin.once('data', () => resolve());
    });
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.log('\nPress Enter to close browser...');
    await new Promise<void>((resolve) => {
      process.stdin.once('data', () => resolve());
    });
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
