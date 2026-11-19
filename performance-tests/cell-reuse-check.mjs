// Cell-reuse guard: across a page change, every app must reuse the row/cell DOM
// (A24) INCLUDING each cell's rendered content — the parity verifier only diffs
// HTML and request logs, so component/DOM recreation is invisible to it and this
// check is what catches it (found 2026-11-18: both Solid apps rebuilt all ~2,650
// cell subtrees per page change while their <td> shells survived).
//
// Per app: open /list, tag the first 3 rows' <tr>/<td> elements and each <td>'s
// first element child, click Next, wait for the last row's code to change, then
// assert: all shells survive, and at least MIN_CONTENT_SURVIVAL of the content
// nodes survive and show the new page's values. 100% is not required because a
// legitimate conditional branch swaps its node when the value flips across pages
// (BooleanYesNo yes→no costs Svelte/Solid ~12% of sampled cells; React/Vue keep
// the node and swap class+text); wholesale recreation lands at 0%, so 50%
// separates the two failure modes cleanly.
//
// Usage: node performance-tests/cell-reuse-check.mjs  (needs the perf builds on
// localhost:8888 and the backend on localhost:3001, same as the benchmark)

import { chromium } from 'playwright';

const MIN_CONTENT_SURVIVAL = 0.5;
const ROWS_SAMPLED = 3;

const frameworks = [
  ['Angular', 'http://localhost:8888/angular'],
  ['React', 'http://localhost:8888/react'],
  ['Svelte', 'http://localhost:8888/svelte'],
  ['Solid', 'http://localhost:8888/solid'],
  ['Lit', 'http://localhost:8888/lit'],
  ['Vue', 'http://localhost:8888/vue'],
  ['Preact', 'http://localhost:8888/preact'],
  ['VueVapor', 'http://localhost:8888/vue-vapor'],
  ['Solid2', 'http://localhost:8888/solid-2'],
];

// Runs entirely in the page so element identity can be compared directly.
// Shadow-DOM-aware for Lit; click goes through a shadow button when the Next
// control is a custom element.
async function checkOne(page, baseUrl, rowsSampled) {
  await page.goto(`${baseUrl}/list`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  return page.evaluate(async (rowsToSample) => {
    function* walk(root) {
      for (const el of root.querySelectorAll('*')) {
        yield el;
        if (el.shadowRoot) yield* walk(el.shadowRoot);
      }
    }
    const rows = [];
    for (const el of walk(document)) {
      if (el.matches('tbody tr')) rows.push(el);
    }
    if (rows.length === 0) return { error: 'no rows rendered' };

    const sampledRows = rows.slice(0, rowsToSample);
    const shells = sampledRows.flatMap((tr) => [tr, ...tr.querySelectorAll('td')]);
    const contents = sampledRows
      .flatMap((tr) => [...tr.querySelectorAll('td')])
      .map((td) => td.firstElementChild)
      .filter(Boolean);
    const textBefore = contents.map((el) => el.textContent.trim());

    const lastRowCode = () => {
      const all = [];
      for (const el of walk(document)) if (el.matches('tbody tr')) all.push(el);
      const last = all[all.length - 1];
      if (!last) return '';
      // The code link may sit behind a nested shadow root (Lit), so walk the row
      for (const el of walk(last)) {
        if (el.matches('a')) return el.textContent.trim();
      }
      return last.textContent.trim();
    };
    const codeBefore = lastRowCode();

    let next = null;
    for (const el of walk(document)) {
      const label = (el.textContent || '').trim();
      if (label === 'Next' && (el.matches('button') || el.tagName.includes('-'))) next = el;
    }
    if (!next) return { error: 'Next button not found' };
    (next.shadowRoot?.querySelector('button') ?? next).click();

    const deadline = Date.now() + 10000;
    while (lastRowCode() === codeBefore) {
      if (Date.now() > deadline) return { error: 'timed out waiting for page change' };
      await new Promise((r) => setTimeout(r, 25));
    }
    await new Promise((r) => setTimeout(r, 250));

    const shellsSurvived = shells.filter((el) => el.isConnected).length;
    const contentsSurvived = contents.filter((el) => el.isConnected).length;
    const survivorsUpdated = contents.filter(
      (el, i) => el.isConnected && el.textContent.trim() !== textBefore[i]
    ).length;
    return {
      shells: shells.length,
      shellsSurvived,
      contents: contents.length,
      contentsSurvived,
      survivorsUpdated,
    };
  }, rowsSampled);
}

const browser = await chromium.launch();
let failures = 0;
console.log('Cell-reuse guard: shells and cell contents must survive a page change\n');
for (const [name, baseUrl] of frameworks) {
  const page = await browser.newPage();
  let r;
  try {
    r = await checkOne(page, baseUrl, ROWS_SAMPLED);
  } catch (e) {
    r = { error: e.message };
  }
  await page.close();
  if (r.error) {
    failures++;
    console.log(`  ✗ ${name.padEnd(10)} ${r.error}`);
    continue;
  }
  const shellsOk = r.shellsSurvived === r.shells;
  const ratio = r.contentsSurvived / r.contents;
  const contentsOk = ratio >= MIN_CONTENT_SURVIVAL;
  const ok = shellsOk && contentsOk;
  if (!ok) failures++;
  console.log(
    `  ${ok ? '✓' : '✗'} ${name.padEnd(10)} shells ${r.shellsSurvived}/${r.shells}` +
    `  cell contents ${r.contentsSurvived}/${r.contents} (${(ratio * 100).toFixed(0)}%)` +
    `  updated in place ${r.survivorsUpdated}` +
    (ok ? '' : shellsOk ? '  ← cell contents recreated' : '  ← rows recreated')
  );
}
await browser.close();
if (failures > 0) {
  console.error(`\n${failures} app(s) failed the cell-reuse guard.`);
  process.exit(1);
}
console.log('\nAll 9 apps reuse rows and cell contents across a page change.');
