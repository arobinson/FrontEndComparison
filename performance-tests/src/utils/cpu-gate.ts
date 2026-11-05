import { cpus } from 'os';

export interface CpuGateResult {
  /** Machine-wide CPU busy % over the last sample window (0-100). */
  busyPct: number;
  /** How long we waited for the machine to settle. */
  waitedMs: number;
  /** True if the machine never dropped below the threshold within maxWaitMs. */
  timedOut: boolean;
}

export interface CpuGateOptions {
  /** Proceed once busy % is at or below this (default 25). */
  thresholdPct: number;
  /** Give up waiting after this long and proceed, flagging the round (default 120s). */
  maxWaitMs: number;
  /** Length of each measurement window (default 1s). */
  sampleMs: number;
}

export const defaultCpuGateOptions: CpuGateOptions = {
  thresholdPct: 25,
  maxWaitMs: 120_000,
  sampleMs: 1_000
};

function snapshot(): { idle: number; total: number } {
  let idle = 0;
  let total = 0;
  for (const cpu of cpus()) {
    const t = cpu.times;
    idle += t.idle;
    total += t.user + t.nice + t.sys + t.irq + t.idle;
  }
  return { idle, total };
}

/** Measure machine-wide CPU busy % over `ms` milliseconds. */
export async function sampleCpuBusy(ms: number): Promise<number> {
  const a = snapshot();
  await new Promise((resolve) => setTimeout(resolve, ms));
  const b = snapshot();
  const total = b.total - a.total;
  const idle = b.idle - a.idle;
  return total > 0 ? Math.round((1 - idle / total) * 1000) / 10 : 0;
}

/**
 * Block until the machine is quiet enough to measure.
 * Other workloads (browsers, builds, indexers) are the main source of
 * batch-to-batch variance, so every round starts from a recorded idle state.
 */
export async function waitForIdleCpu(options: CpuGateOptions = defaultCpuGateOptions): Promise<CpuGateResult> {
  const start = Date.now();
  let busyPct = await sampleCpuBusy(options.sampleMs);
  let warned = false;

  while (busyPct > options.thresholdPct) {
    const waitedMs = Date.now() - start;
    if (waitedMs >= options.maxWaitMs) {
      console.warn(
        `  ⚠️  CPU still ${busyPct}% busy after ${Math.round(waitedMs / 1000)}s (threshold ${options.thresholdPct}%) - proceeding, round flagged`
      );
      return { busyPct, waitedMs, timedOut: true };
    }
    if (!warned) {
      console.log(`  ⏳ CPU ${busyPct}% busy (threshold ${options.thresholdPct}%), waiting for machine to settle...`);
      warned = true;
    }
    busyPct = await sampleCpuBusy(options.sampleMs);
  }

  return { busyPct, waitedMs: Date.now() - start, timedOut: false };
}
