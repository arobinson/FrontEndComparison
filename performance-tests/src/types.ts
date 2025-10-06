export interface TestScenario {
  name: string;
  description: string;
  run: (context: TestContext) => Promise<ScenarioResult>;
}

export interface TestContext {
  page: any; // Playwright Page
  baseUrl: string;
  framework: string;
}

export interface ScenarioResult {
  scenarioName: string;
  framework: string;
  measurements: Measurement[];
}

export interface Measurement {
  name: string;
  value: number;
  unit: string;
  metadata?: Record<string, unknown>;
}

export interface WebVitals {
  fcp: number; // First Contentful Paint (ms)
  lcp: number; // Largest Contentful Paint (ms)
  cls: number; // Cumulative Layout Shift (score)
  tti: number; // Time to Interactive (ms)
  tbt: number; // Total Blocking Time (ms)
  fid?: number; // First Input Delay (ms, optional - requires user interaction)
}

export interface MemoryMetrics {
  heapSize: number; // bytes
  usedHeapSize: number; // bytes
  heapLimit: number; // bytes
}

export interface NetworkMetrics {
  requestCount: number;
  totalBytes: number;
  totalDuration: number; // ms
  largestRequestSize: number; // bytes
  apiResponseTimes: number[]; // ms
}

export interface BuildMetrics {
  buildTime: number; // ms
  fileCount: number;
  totalSize: number; // bytes
  gzippedSize?: number; // bytes
  largestFileSize: number; // bytes
  chunkDistribution?: Record<string, number>; // chunk name -> size in bytes
}

export interface TestRun {
  runNumber: number;
  framework: string;
  scenario: string;
  timestamp: string;
  measurements: Measurement[];
}

export interface AggregatedResults {
  framework: string;
  scenario: string;
  totalRuns: number;
  discardedRuns: number[]; // run numbers that were discarded (highest/lowest)
  median: Record<string, number>; // metric name -> median value
  mean: Record<string, number>; // metric name -> mean value
  min: Record<string, number>; // metric name -> min value
  max: Record<string, number>; // metric name -> max value
  stdDev: Record<string, number>; // metric name -> standard deviation
}

export interface TestConfig {
  frameworks: FrameworkConfig[];
  repetitions: number;
  discardOutliers: boolean;
  outputDir: string;
  viewportWidth: number;
  viewportHeight: number;
}

export interface FrameworkConfig {
  name: string;
  baseUrl: string;
  buildCommand: string;
  buildOutputDir: string;
}
