import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { arch, cpus, platform, release, totalmem } from 'os';
import { join } from 'path';
import { FrameworkConfig } from '../types.js';

export interface EnvironmentInfo {
  node: string;
  os: string;
  cpuModel: string;
  cpuCores: number;
  totalMemoryGB: number;
  browser: string;
  playwright: string;
  gitCommit: string;
  gitDirty: boolean;
  /** Framework/runtime package versions actually installed in each app (not the ranges in package.json). */
  frameworkVersions: Record<string, Record<string, string>>;
}

/** Packages that define "which version of the framework" each app runs. */
const KEY_PACKAGES = [
  '@angular/core',
  'react',
  'react-dom',
  'react-router',
  'svelte',
  '@sveltejs/kit',
  'solid-js',
  '@solidjs/router',
  'lit',
  '@lit-labs/router',
  'vue',
  'vue-router',
  'preact',
  'preact-iso',
  'vite',
  'typescript'
];

function git(args: string, cwd: string): string {
  try {
    return execSync(`git ${args}`, { cwd, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'unknown';
  }
}

function installedVersion(appDir: string, pkg: string): string | undefined {
  const pkgJson = join(appDir, 'node_modules', pkg, 'package.json');
  if (!existsSync(pkgJson)) return undefined;
  try {
    return JSON.parse(readFileSync(pkgJson, 'utf-8')).version;
  } catch {
    return undefined;
  }
}

export function collectEnvironment(browserVersion: string, frameworks: FrameworkConfig[]): EnvironmentInfo {
  const repoRoot = join(process.cwd(), '..');
  const frameworkVersions: Record<string, Record<string, string>> = {};

  for (const framework of frameworks) {
    const appDir = join(repoRoot, `${framework.name}FoodFacts`);
    const versions: Record<string, string> = {};
    for (const pkg of KEY_PACKAGES) {
      const version = installedVersion(appDir, pkg);
      if (version) versions[pkg] = version;
    }
    frameworkVersions[framework.name] = versions;
  }

  const cpuList = cpus();
  return {
    node: process.version,
    os: `${platform()} ${release()} ${arch()}`,
    cpuModel: cpuList[0]?.model ?? 'unknown',
    cpuCores: cpuList.length,
    totalMemoryGB: Math.round((totalmem() / 1024 ** 3) * 10) / 10,
    browser: browserVersion,
    playwright: installedVersion(process.cwd(), 'playwright') ?? 'unknown',
    gitCommit: git('rev-parse HEAD', repoRoot),
    gitDirty: git('status --porcelain', repoRoot) !== '',
    frameworkVersions
  };
}
