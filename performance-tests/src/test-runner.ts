import { chromium, Browser, Page } from 'playwright';
import { TestScenario, TestContext, TestRun, TestConfig, FrameworkConfig } from './types.js';
import { injectPerformanceObservers } from './utils/performance-helpers.js';
import { NetworkTracker } from './utils/network-tracker.js';

export class TestRunner {
  #config: TestConfig;
  #browser: Browser | null = null;

  constructor(config: TestConfig) {
    this.#config = config;
  }

  async initialize(): Promise<void> {
    this.#browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
  }

  async cleanup(): Promise<void> {
    if (this.#browser) {
      await this.#browser.close();
      this.#browser = null;
    }
  }

  async restartBrowser(): Promise<void> {
    console.log('  🔄 Restarting browser to clear state...');
    await this.cleanup();
    await this.initialize();
  }

  async runScenario(
    framework: FrameworkConfig,
    scenario: TestScenario
  ): Promise<TestRun[]> {
    let result: TestRun[];
    if (!this.#browser) {
      throw new Error('Test runner not initialized. Call initialize() first.');
    }

    console.log(`\nRunning scenario: ${scenario.name} for framework: ${framework.name}`);
    console.log(`Repetitions: ${this.#config.repetitions}`);

    const runs: TestRun[] = [];

    for (let i = 0; i < this.#config.repetitions; i++) {
      console.log(`  Run ${i + 1}/${this.#config.repetitions}...`);

      const page = await this.#browser.newPage();
      await page.setViewportSize({
        width: this.#config.viewportWidth,
        height: this.#config.viewportHeight,
      });

      // Inject performance observers before navigation
      await injectPerformanceObservers(page);

      // Create network tracker
      const networkTracker = new NetworkTracker(page);

      const context: TestContext = {
        page,
        baseUrl: framework.baseUrl,
        framework: framework.name,
      };

      try {
        // Run the scenario
        const scenarioResult = await scenario.run(context);

        const testRun: TestRun = {
          runNumber: i + 1,
          framework: framework.name,
          scenario: scenario.name,
          timestamp: new Date().toISOString(),
          measurements: scenarioResult.measurements,
        };

        runs.push(testRun);
      } catch (error) {
        console.error(`    Error in run ${i + 1}:`, error);
        throw error;
      } finally {
        networkTracker.stop();
        try {
          if (!page.isClosed()) {
            await page.close();
          }
        } catch (closeError) {
          console.warn(`    Warning: Could not close page: ${closeError}`);
        }
      }

      // Small delay between runs to let system stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    result = runs;
    return result;
  }

  async runAllScenarios(
    framework: FrameworkConfig,
    scenarios: TestScenario[]
  ): Promise<TestRun[]> {
    let result: TestRun[];
    const allRuns: TestRun[] = [];

    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i];

      // Restart browser between scenarios to prevent resource exhaustion
      if (i > 0) {
        await this.restartBrowser();
      }

      const runs = await this.runScenario(framework, scenario);
      allRuns.push(...runs);
    }

    result = allRuns;
    return result;
  }

  async runAllFrameworks(
    scenarios: TestScenario[]
  ): Promise<Map<string, TestRun[]>> {
    let result: Map<string, TestRun[]>;
    const resultsByFramework = new Map<string, TestRun[]>();

    for (const framework of this.#config.frameworks) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Testing Framework: ${framework.name}`);
      console.log(`${'='.repeat(60)}`);

      const runs = await this.runAllScenarios(framework, scenarios);
      resultsByFramework.set(framework.name, runs);
    }

    result = resultsByFramework;
    return result;
  }
}
