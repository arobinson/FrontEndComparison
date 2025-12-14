#!/usr/bin/env node
/**
 * Post-process Mermaid SVG charts to assign gradient colors per framework
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Gradient definitions for each framework - softer, more appealing colors
const GRADIENT_DEFS = `
  <defs>
    <linearGradient id="grad-angular" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C92A2A;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad-react" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#74C0FC;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#339AF0;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad-svelte" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FFA94D;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F76707;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad-solid" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#69DB7C;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2F9E44;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad-lit" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#B197FC;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7950F2;stop-opacity:1" />
    </linearGradient>
  </defs>
`;

const GRADIENT_IDS = [
  'url(#grad-angular)',
  'url(#grad-react)',
  'url(#grad-svelte)',
  'url(#grad-solid)',
  'url(#grad-lit)',
];

const blogDir = new URL('.', import.meta.url).pathname;
const svgFiles = readdirSync(blogDir).filter(f => f.endsWith('.svg'));

for (const file of svgFiles) {
  const filePath = join(blogDir, file);
  let svg = readFileSync(filePath, 'utf-8');

  // Add gradient definitions after the opening <svg> tag
  svg = svg.replace(/(<svg[^>]*>)/, `$1${GRADIENT_DEFS}`);

  // Find the bar-plot group and replace each rect's fill with gradient
  let barIndex = 0;
  svg = svg.replace(/<g class="bar-plot-0">([\s\S]*?)<\/g>/g, (match, content) => {
    const coloredContent = content.replace(/<rect([^>]*)fill="[^"]*"([^>]*)>/g, (rectMatch, before, after) => {
      const gradient = GRADIENT_IDS[barIndex % 5];
      barIndex++;
      return `<rect${before}fill="${gradient}"${after}>`;
    });
    return `<g class="bar-plot-0">${coloredContent}</g>`;
  });

  writeFileSync(filePath, svg);
  console.log(`✅ Colorized ${file} (${barIndex} bars with gradients)`);
}

console.log('\nDone! Framework gradient colors:');
console.log('  Angular  = Red gradient (coral → crimson)');
console.log('  React    = Blue gradient (sky → azure)');
console.log('  Svelte   = Orange gradient (peach → tangerine)');
console.log('  SolidJS  = Green gradient (mint → emerald)');
console.log('  Lit      = Purple gradient (lavender → violet)');
