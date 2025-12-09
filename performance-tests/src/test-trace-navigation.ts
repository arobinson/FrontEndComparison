import { chromium, Browser, Page } from 'playwright';
import { mkdir } from 'fs/promises';
import { join } from 'path';

interface FrameworkConfig {
  name: string;
  baseUrl: string;
}

async function captureNavigationTrace(
  framework: FrameworkConfig,
  outputDir: string
): Promise<void> {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page: Page = await context.newPage();

  const traceFile = join(outputDir, `${framework.name.toLowerCase()}-back-navigation-trace.json`);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Capturing trace for ${framework.name}`);
  console.log(`${'='.repeat(60)}`);

  try {
    // Navigate to the list page first (baseUrl redirects to /list)
    console.log('1. Loading list page...');
    await page.goto(framework.baseUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('tbody tr', { timeout: 30000 });
    console.log('   List page loaded');

    // Click on first product to go to detail
    console.log('2. Navigating to detail page...');
    const productLink = await page.waitForSelector('tbody tr:first-child a', { timeout: 10000 });
    await productLink?.click();
    await page.waitForSelector('.back-button', { timeout: 30000 });
    console.log('   Detail page loaded');

    // Wait a moment for everything to settle
    await page.waitForTimeout(500);

    // Start Chrome DevTools Protocol tracing
    console.log('3. Starting performance trace...');
    const client = await context.newCDPSession(page);

    await client.send('Tracing.start', {
      categories: [
        'devtools.timeline',
        'v8.execute',
        'blink.user_timing',
        'loading',
        'devtools.timeline.frame',
        'blink.console',
        'disabled-by-default-devtools.timeline',
        'disabled-by-default-devtools.timeline.frame',
        'disabled-by-default-v8.cpu_profiler'
      ].join(','),
      options: 'sampling-frequency=10000'
    });

    // Navigate back and wait for list to render
    console.log('4. Clicking back button (trace recording)...');
    const startTime = Date.now();

    await page.click('.back-button');
    await page.waitForSelector('tbody tr', { timeout: 30000 });
    await page.waitForFunction(
      () => document.querySelectorAll('tbody tr').length >= 10,
      { timeout: 30000 }
    );

    const endTime = Date.now();
    console.log(`   Back navigation completed in ${endTime - startTime}ms`);

    // Wait a bit more to capture any post-render work
    await page.waitForTimeout(500);

    // Stop tracing and save
    console.log('5. Stopping trace and saving...');
    const traceData = await client.send('Tracing.end');

    // Collect trace events
    const events: any[] = [];
    client.on('Tracing.tracingComplete', () => {});
    client.on('Tracing.dataCollected', (data) => {
      events.push(...data.value);
    });

    // Wait for trace data
    await new Promise<void>((resolve) => {
      client.once('Tracing.tracingComplete', () => resolve());
    });

    // Write trace file
    const { writeFile } = await import('fs/promises');
    await writeFile(traceFile, JSON.stringify({ traceEvents: events }, null, 2));
    console.log(`   Trace saved to: ${traceFile}`);

    // Quick analysis of the trace
    console.log('\n6. Quick trace analysis:');
    analyzeTrace(events, framework.name);

  } finally {
    await browser.close();
  }
}

function analyzeTrace(events: any[], frameworkName: string): void {
  // Find scripting time
  const scriptingEvents = events.filter(
    (e) => e.cat?.includes('devtools.timeline') &&
           (e.name === 'FunctionCall' || e.name === 'EvaluateScript' || e.name === 'v8.compile')
  );

  // Find rendering/layout events
  const layoutEvents = events.filter(
    (e) => e.name === 'Layout' || e.name === 'UpdateLayoutTree'
  );

  const paintEvents = events.filter(
    (e) => e.name === 'Paint' || e.name === 'Commit'
  );

  const styleEvents = events.filter(
    (e) => e.name === 'RecalculateStyles' || e.name === 'UpdateLayerTree'
  );

  // Calculate total durations
  const calcDuration = (evts: any[]) =>
    evts.reduce((sum, e) => sum + (e.dur || 0), 0) / 1000; // Convert to ms

  console.log(`   Scripting events: ${scriptingEvents.length} (${calcDuration(scriptingEvents).toFixed(1)}ms)`);
  console.log(`   Layout events: ${layoutEvents.length} (${calcDuration(layoutEvents).toFixed(1)}ms)`);
  console.log(`   Style recalc events: ${styleEvents.length} (${calcDuration(styleEvents).toFixed(1)}ms)`);
  console.log(`   Paint events: ${paintEvents.length} (${calcDuration(paintEvents).toFixed(1)}ms)`);

  // Find longest individual events
  const allTimedEvents = events.filter((e) => e.dur && e.dur > 1000); // > 1ms
  allTimedEvents.sort((a, b) => (b.dur || 0) - (a.dur || 0));

  console.log('\n   Top 10 longest events:');
  allTimedEvents.slice(0, 10).forEach((e, i) => {
    console.log(`   ${i + 1}. ${e.name}: ${((e.dur || 0) / 1000).toFixed(1)}ms`);
  });

  // Look for Angular/React specific markers
  const userTimingEvents = events.filter((e) => e.cat?.includes('blink.user_timing'));
  if (userTimingEvents.length > 0) {
    console.log('\n   User timing marks:');
    userTimingEvents.slice(0, 10).forEach((e) => {
      console.log(`   - ${e.name}`);
    });
  }
}

async function main(): Promise<void> {
  const outputDir = join(process.cwd(), 'results', 'traces');
  await mkdir(outputDir, { recursive: true });

  const frameworks: FrameworkConfig[] = [
    { name: 'Angular', baseUrl: 'http://localhost:8888/angular' },
    { name: 'React', baseUrl: 'http://localhost:8888/react' }
  ];

  for (const framework of frameworks) {
    await captureNavigationTrace(framework, outputDir);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Traces saved! You can load them in Chrome DevTools:');
  console.log('1. Open Chrome DevTools (F12)');
  console.log('2. Go to Performance tab');
  console.log('3. Click "Load profile" and select the .json file');
  console.log('='.repeat(60));
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
