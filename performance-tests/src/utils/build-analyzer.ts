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
): Promise<Omit<BuildMetrics, 'buildTime'> & { detailed?: any }> {
  let result: Omit<BuildMetrics, 'buildTime'> & { detailed?: any };
  const files = await getAllFiles(outputDir);

  let totalSize = 0;
  let largestFileSize = 0;
  let totalGzippedSize = 0;
  const chunkDistribution: Record<string, number> = {};
  const chunkDistributionGzip: Record<string, number> = {};

  // Categorize files
  let initialSize = 0;
  let lazySize = 0;
  let vendorSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  let initialGzipSize = 0;
  let lazyGzipSize = 0;
  let vendorGzipSize = 0;
  let jsGzipSize = 0;
  let cssGzipSize = 0;

  let jsFileCount = 0;
  let cssFileCount = 0;
  let initialChunkCount = 0;
  let lazyChunkCount = 0;

  for (const file of files) {
    const filename = file.split('/').pop() || '';

    // Skip non-bundle files
    if (filename === 'index.html' || filename.endsWith('.ico') || filename.endsWith('.txt')) {
      continue;
    }

    const fileStats = await stat(file);
    const fileSize = fileStats.size;

    totalSize += fileSize;

    if (fileSize > largestFileSize) {
      largestFileSize = fileSize;
    }

    // Categorize file
    const isJs = file.endsWith('.js');
    const isCss = file.endsWith('.css');
    const isInitial = filename.startsWith('main-') || filename.startsWith('polyfills-') || filename.startsWith('styles-');
    const isLazy = filename.includes('chunk-') && (filename.includes('product-list') || filename.includes('product-detail'));
    const isVendor = !isInitial && !isLazy && filename.includes('chunk-');

    if (isJs) {
      jsSize += fileSize;
      jsFileCount++;
      const content = await readFile(file);
      const gzipped = await gzipAsync(content);
      const gzipSize = gzipped.length;
      totalGzippedSize += gzipSize;
      jsGzipSize += gzipSize;

      chunkDistribution[filename] = fileSize;
      chunkDistributionGzip[filename] = gzipSize;

      if (isInitial) {
        initialSize += fileSize;
        initialGzipSize += gzipSize;
        initialChunkCount++;
      } else if (isLazy) {
        lazySize += fileSize;
        lazyGzipSize += gzipSize;
        lazyChunkCount++;
      } else if (isVendor) {
        vendorSize += fileSize;
        vendorGzipSize += gzipSize;
      }
    } else if (isCss) {
      cssSize += fileSize;
      cssFileCount++;
      const content = await readFile(file);
      const gzipped = await gzipAsync(content);
      const gzipSize = gzipped.length;
      totalGzippedSize += gzipSize;
      cssGzipSize += gzipSize;

      chunkDistribution[filename] = fileSize;
      chunkDistributionGzip[filename] = gzipSize;

      if (isInitial) {
        initialSize += fileSize;
        initialGzipSize += gzipSize;
        initialChunkCount++;
      }
    }
  }

  result = {
    fileCount: jsFileCount + cssFileCount,
    totalSize,
    gzippedSize: totalGzippedSize,
    largestFileSize,
    chunkDistribution,
    detailed: {
      initialSize,
      lazySize,
      vendorSize,
      initialGzipSize,
      lazyGzipSize,
      vendorGzipSize,
      jsSize,
      cssSize,
      jsGzipSize,
      cssGzipSize,
      jsFileCount,
      cssFileCount,
      initialChunkCount,
      lazyChunkCount,
      compressionRatio: totalSize > 0 ? (totalGzippedSize / totalSize) : 0,
      chunkDistributionGzip,
    },
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
  console.log(`Total size: ${(result.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Gzipped size: ${(result.gzippedSize! / 1024).toFixed(2)} KB`);
  console.log(`Compression ratio: ${((result as any).detailed.compressionRatio * 100).toFixed(1)}%`);
  console.log(`\nBreakdown:`);
  console.log(`  Initial: ${((result as any).detailed.initialSize / 1024).toFixed(2)} KB (gzip: ${((result as any).detailed.initialGzipSize / 1024).toFixed(2)} KB)`);
  console.log(`  Lazy: ${((result as any).detailed.lazySize / 1024).toFixed(2)} KB (gzip: ${((result as any).detailed.lazyGzipSize / 1024).toFixed(2)} KB)`);
  console.log(`  Vendor: ${((result as any).detailed.vendorSize / 1024).toFixed(2)} KB (gzip: ${((result as any).detailed.vendorGzipSize / 1024).toFixed(2)} KB)`);
  console.log(`  JS: ${((result as any).detailed.jsSize / 1024).toFixed(2)} KB (${(result as any).detailed.jsFileCount} files)`);
  console.log(`  CSS: ${((result as any).detailed.cssSize / 1024).toFixed(2)} KB (${(result as any).detailed.cssFileCount} files)`);

  return result;
}
