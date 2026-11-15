# Quiet-machine run, 2026-11-15

Machine: i7-8850H ×12, Chromium 156.0.8078.4, Node 24.22.2. Antivirus and Spotlight off, other apps closed.
Protocol: 1 warm-up + 5 measured rounds per scenario, frameworks shuffled per round, fresh context per run,
idle-CPU gate ≤ 25% (every round passed, 1–23% busy).

## Datasets

| File | What | Use |
|---|---|---|
| `results-2026-11-15T00-42-36-854Z.json` | full run, 9 apps × 8 scenarios, warm browser | scenarios 02–07, 09 |
| `results-2026-11-15T00-55-42-165Z.json` | re-run of `initial-page-load` and `detail-navigation-cycle` | those two scenarios (replaces T00-42 for them) |
| `results-2026-11-15T00-45-49-019Z.json` | `initial-page-load`, cold browser (relaunch per run) | first-visit table |
| `bundle-sizes-2026-11-15T*.json` | gzip -9 of JS+CSS: loaded by `/list`, and whole build | bundle table |

Why the re-runs: T00-42's warm `initial-page-load` (first scenario after the harness build) ran 20–45% slow and
noisy for every app, while the cold pass right after was tight; the re-run is tight (CV ≤ 2% except Solid 5%) and agrees with the
cold pass. `detail-navigation-cycle` in T00-42 clicked "← Back to List" instead of "← Previous" (changelog A28).

## Composite (geomean of median ÷ best ranked median, per scenario)

1.00 = best ranked framework in every scenario. `*` = preview, not ranked (scored against the same baselines).

| Framework | Composite | Load | Filter | Clear | Expand | To detail | Back | Page | Detail cycle |
|---|---|---|---|---|---|---|---|---|---|
| Svelte | **1.10** | 1.52 | 1.00 | 1.04 | 1.00 | 1.04 | 1.28 | 1.00 | 1.05 |
| Preact | **1.15** | 1.00 | 1.14 | 1.22 | 1.78 | 1.07 | 1.00 | 1.17 | 1.01 |
| React | **1.19** | 1.17 | 1.16 | 1.00 | 1.68 | 1.04 | 1.01 | 1.08 | 1.53 |
| Lit | **1.28** | 1.24 | 1.29 | 1.17 | 1.64 | 1.10 | 1.66 | 1.27 | 1.00 |
| Vue | **1.29** | 1.32 | 1.40 | 1.42 | 1.67 | 1.00 | 1.26 | 1.34 | 1.02 |
| Solid | **1.34** | 1.51 | 1.65 | 1.59 | 1.01 | 1.01 | 1.68 | 1.48 | 1.01 |
| Solid 2 * | 1.37 | 1.82 | 1.47 | 1.68 | 0.94 | 1.09 | 1.64 | 1.59 | 1.04 |
| Angular | **1.41** | 2.11 | 1.23 | 1.35 | 1.44 | 1.25 | 1.85 | 1.27 | 1.08 |
| Vue Vapor * | 1.48 | 1.83 | 1.41 | 1.46 | 2.82 | 1.07 | 1.50 | 1.31 | 1.05 |

Primary metrics (harness defaults): load `time_to_table`, filter `filter_duration`, clear `clear_duration`,
expand `expand_duration`, to detail `total_navigation_time`, back `total_back_navigation_time`,
page `page_transition_1_next`, detail cycle `initial_detail_load`.

## Medians (ms)

| Scenario | Angular | React | Svelte | Solid | Lit | Vue | Preact | Vapor * | Solid 2 * |
|---|---|---|---|---|---|---|---|---|---|
| Initial load (warm) | 320 | 177 | 230 | 229 | 188 | 201 | 152 | 277 | 276 |
| Initial load (cold browser) | 328 | 180 | 249 | 226 | 189 | 207 | 156 | 283 | 275 |
| Filter | 123 | 116 | 99 | 164 | 129 | 139 | 114 | 140 | 146 |
| Clear filters | 362 | 268 | 279 | 427 | 314 | 380 | 327 | 392 | 451 |
| Expand | 25 | 29 | 17 | 17 | 28 | 29 | 31 | 48 | 16 |
| To detail | 227 | 189 | 189 | 183 | 201 | 182 | 194 | 194 | 199 |
| Back to list | 347 | 189 | 240 | 316 | 312 | 237 | 188 | 282 | 308 |
| Page (1st next) | 353 | 298 | 277 | 411 | 353 | 371 | 323 | 363 | 440 |
| Detail cycle (initial load) | 668 | 946 | 651 | 625 | 619 | 633 | 623 | 648 | 646 |
| Detail cycle (avg next/prev) | 20 | 16 | 18 | 16 | 13 | 10 | 25 | 19 | 14 |

## Bundle size (gzip -9, JS + CSS, KB)

| | Angular | React | Svelte | Solid | Lit | Vue | Preact | Vapor * | Solid 2 * |
|---|---|---|---|---|---|---|---|---|---|
| Loaded by `/list` | 90.6 | 95.6 | 50.3 | 31.0 | 22.9 | 46.6 | 20.5 | 70.9 | 53.8 |
| Whole build | 95.4 | 101.5 | 56.3 | 35.2 | 22.9 | 50.8 | 24.0 | 75.3 | 58.2 |

## Open questions / caveats

1. **React's detail-cycle 1.53 is React 19's Suspense reveal throttle.** A direct load of `/react/detail/1` shows the
   heading at ~398 ms vs 71–117 ms for the others: the lazy route suspends with a committed fallback, and React
   delays the reveal until 300 ms after the fallback (`FALLBACK_THROTTLE_MS`, retry lanes). The list scenarios open
   `/react`, whose `<Navigate>` redirect runs as a transition (no fallback, no throttle). Any direct deep link into
   React pays it, including shared `/list?…` URLs. **Decided (A29): keep and footnote**, like Angular's lazy route bundles: a cost of route splitting, which makes the first page faster. Tested: `startTransition` first render, no effect; React Router data mode, fixes it (133 ms).
2. **`initial_detail_load` includes a ~500 ms `networkidle` floor** for everyone, which compresses ratios
   (React 946 vs Lit 619 = 1.53×; time-to-heading ratio is ~5×). The scenario says it measures update speed;
   ranking it on `avg_navigation_time` instead gives Svelte 1.18, React 1.19, Vue 1.28, Preact 1.29, Lit 1.32,
   Solid 1.42, Angular 1.52 — but that metric is 10–25 ms and frame-quantized, so one 15 ms gap swings the composite.
3. **Frame-quantized rows** (two-valued runs): expand (Solid/Svelte 6 vs 17 ms, Vapor 27 vs 48), React page 150 vs 300,
   Solid 2 to-detail 99 vs 200. Medians used; footnote the expand and page rows.
4. **Filter** round 1 is slow for every framework (first measured round); medians and minimums are stable.
5. **A27 footnotes** still apply to filter, clear, expand, back and page (list state in the URL).
