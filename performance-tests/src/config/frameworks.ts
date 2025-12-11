import { join } from 'path';
import { FrameworkConfig } from '../types.js';

/**
 * All available framework configurations for performance testing.
 * Each framework must have a corresponding build:perf script and output directory.
 */
export const allFrameworks: FrameworkConfig[] = [
  {
    name: 'Angular',
    baseUrl: 'http://localhost:8888/angular',
    buildCommand: 'pnpm run build:perf',
    buildOutputDir: join(process.cwd(), '../perf-dist/angular')
  },
  {
    name: 'React',
    baseUrl: 'http://localhost:8888/react',
    buildCommand: 'pnpm run build:perf',
    buildOutputDir: join(process.cwd(), '../perf-dist/react')
  },
  {
    name: 'Svelte',
    baseUrl: 'http://localhost:8888/svelte',
    buildCommand: 'pnpm run build:perf',
    buildOutputDir: join(process.cwd(), '../perf-dist/svelte')
  },
  {
    name: 'Solid',
    baseUrl: 'http://localhost:8888/solid',
    buildCommand: 'pnpm run build:perf',
    buildOutputDir: join(process.cwd(), '../perf-dist/solid')
  },
  {
    name: 'Lit',
    baseUrl: 'http://localhost:8888/lit',
    buildCommand: 'pnpm run build:perf',
    buildOutputDir: join(process.cwd(), '../perf-dist/lit')
  }
];

/**
 * Get framework configs by name.
 * @param names - Framework names to include (e.g., ['Angular', 'React'])
 * @returns Filtered framework configs
 */
export function getFrameworks(names?: string[]): FrameworkConfig[] {
  if (!names || names.length === 0) {
    return allFrameworks;
  }
  return allFrameworks.filter(f => names.includes(f.name));
}

/**
 * Default test configuration values
 */
export const defaultTestConfig = {
  repetitions: 5,
  discardOutliers: false,
  outputDir: join(process.cwd(), 'results'),
  viewportWidth: 1920,
  viewportHeight: 1080
} as const;
