import { chromium, Browser } from 'playwright';
import { TestScenario, TestContext, TestRun, TestConfig, FrameworkConfig } from './types.js';
import { injectPerformanceObservers } from './utils/performance-helpers.js';
import { NetworkTracker } from './utils/network-tracker.js';
import { waitForIdleCpu, CpuGateResult } from './utils/cpu-gate.js';

/** Deterministic PRNG (mulberry32) so a run's shuffle order is reproducible from its seed. */
function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], rng: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export class TestRunner {
  #config: TestConfig;
  #browser: Browser | null = null;

  constructor(config: TestConfig) {
    this.#config = config;
  }

  get browserVersion(): string {
    return this.#browser?.version() ?? 'unknown';
  }

  async initialize(): Promise<void> {
    this.#browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  }

  async cleanup(): Promise<void> {
    if (this.#browser) {
      await this.#browser.close();
      this.#browser = null;
    }
  }

  async restartBrowser(): Promise<void> {
    await this.cleanup();
    await this.initialize();
  }

  /**
   * One measured run of one scenario for one framework.
   * Each run gets its own BrowserContext, so every measurement starts from the
   * same state (empty HTTP cache, no storage) instead of runs 2..N inheriting
   * run 1's cache.
   */
  async runOnce(framework: FrameworkConfig, scenario: TestScenario, runNumber: number): Promise<TestRun> {
    if (!this.#browser) {
      throw new Error('Test runner not initialized. Call initialize() first.');
    }

    const browserContext = await this.#browser.newContext({
      viewport: { width: this.#config.viewportWidth, height: this.#config.viewportHeight }
    });
    const page = await browserContext.newPage();

    // Inject performance observers before navigation
    await injectPerformanceObservers(page);
    const networkTracker = new NetworkTracker(page);

    const context: TestContext = {
      page,
      baseUrl: framework.baseUrl,
      framework: framework.name
    };

    try {
      const scenarioResult = await scenario.run(context);
      return {
        runNumber,
        framework: framework.name,
        scenario: scenario.name,
        timestamp: new Date().toISOString(),
        measurements: scenarioResult.measurements
      };
    } finally {
      networkTracker.stop();
      try {
        await browserContext.close();
      } catch (closeError) {
        console.warn(`    Warning: Could not close browser context: ${closeError}`);
      }
    }
  }

  /**
   * Interleaved measurement protocol.
   *
   * For each scenario: (warm-up rounds, discarded) + N measured rounds. Every
   * round runs each framework exactly once, in a freshly shuffled order, and
   * starts only after the idle-CPU gate passes. Machine drift (thermal
   * throttling, background work) therefore spreads across all frameworks
   * instead of landing on whichever one happened to be running - the old
   * framework -> scenario -> repetitions order made drift look like a
   * framework difference.
   */
  async runAllFrameworks(scenarios: TestScenario[]): Promise<Map<string, TestRun[]>> {
    const { frameworks, repetitions, warmupRounds, seed, cpuThresholdPct, cpuMaxWaitMs } = this.#config;
    const rng = createRng(seed);
    const resultsByFramework = new Map<string, TestRun[]>(frameworks.map((f) => [f.name, []]));
    const gateOptions = { thresholdPct: cpuThresholdPct, maxWaitMs: cpuMaxWaitMs, sampleMs: 1_000 };

    for (const scenario of scenarios) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Scenario: ${scenario.name}  (${warmupRounds} warm-up + ${repetitions} measured rounds)`);
      console.log(`${'='.repeat(60)}`);

      // Fresh browser per scenario to prevent resource build-up
      await this.restartBrowser();

      for (let round = 1 - warmupRounds; round <= repetitions; round++) {
        const isWarmup = round < 1;
        const order = shuffled(frameworks, rng);
        const gate: CpuGateResult = await waitForIdleCpu(gateOptions);
        const label = isWarmup ? `warm-up ${round + warmupRounds}/${warmupRounds}` : `round ${round}/${repetitions}`;
        console.log(`  ${label}  cpu ${gate.busyPct}%${gate.timedOut ? ' ⚠️' : ''}  order: ${order.map((f) => f.name).join(' → ')}`);

        for (let position = 0; position < order.length; position++) {
          const framework = order[position];
          try {
            const run = await this.runOnce(framework, scenario, round);
            if (!isWarmup) {
              run.orderInRound = position + 1;
              run.cpuBusyPct = gate.busyPct;
              run.cpuGateTimedOut = gate.timedOut;
              resultsByFramework.get(framework.name)!.push(run);
            }
          } catch (error) {
            console.error(`    Error: ${framework.name} ${scenario.name} ${label}:`, error);
            throw error;
          }
          // Small pause between runs to let the system settle
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    return resultsByFramework;
  }
}
