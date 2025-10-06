import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { gzip } from 'zlib';
import { readFile } from 'fs/promises';
import { BuildMetrics } from '../types.js';

const execAsync = promisify(exec);
const gzipAsync = promisify(gzip);

export async function measureBuildTime(
  buildCommand: string,
  cwd: string
): Promise<number> {
  let result: number;
  const startTime = Date.now();

  try {
    await execAsync(buildCommand, { cwd });
    const endTime = Date.now();
    result = endTime - startTime;
  } catch (error) {
    console.error('Build failed:', error);
    throw error;
  }

  return result;
}

export async function analyzeBundleSize(
  outputDir: string
): Promise<Omit<BuildMetrics, 'buildTime'>> {
  let result: Omit<BuildMetrics, 'buildTime'>;
  const files = await getAllFiles(outputDir);

  let totalSize = 0;
  let largestFileSize = 0;
  let totalGzippedSize = 0;
  const chunkDistribution: Record<string, number> = {};

  for (const file of files) {
    const fileStats = await stat(file);
    const fileSize = fileStats.size;

    totalSize += fileSize;

    if (fileSize > largestFileSize) {
      largestFileSize = fileSize;
    }

    // Calculate gzipped size for JS files
    if (file.endsWith('.js')) {
      const content = await readFile(file);
      const gzipped = await gzipAsync(content);
      totalGzippedSize += gzipped.length;

      // Track chunk distribution
      const filename = file.split('/').pop() || '';
      chunkDistribution[filename] = fileSize;
    }
  }

  result = {
    fileCount: files.length,
    totalSize,
    gzippedSize: totalGzippedSize,
    largestFileSize,
    chunkDistribution,
  };
  return result;
}

async function getAllFiles(dir: string): Promise<string[]> {
  let result: string[];
  const entries = await readdir(dir, { withFileTypes: true });

  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await getAllFiles(fullPath);
      files.push(...subFiles);
    } else {
      files.push(fullPath);
    }
  }

  result = files;
  return result;
}

export async function runBuildAnalysis(
  frameworkName: string,
  buildCommand: string,
  buildOutputDir: string,
  cwd: string
): Promise<BuildMetrics> {
  let result: BuildMetrics;
  console.log(`\nAnalyzing build for ${frameworkName}...`);
  console.log(`Running: ${buildCommand}`);

  const buildTime = await measureBuildTime(buildCommand, cwd);
  console.log(`Build completed in ${buildTime}ms`);

  console.log(`Analyzing bundle size in ${buildOutputDir}...`);
  const bundleMetrics = await analyzeBundleSize(buildOutputDir);

  result = {
    buildTime,
    ...bundleMetrics,
  };

  console.log(`Total files: ${result.fileCount}`);
  console.log(`Total size: ${(result.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Gzipped size: ${(result.gzippedSize! / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Largest file: ${(result.largestFileSize / 1024).toFixed(2)} KB`);

  return result;
}
