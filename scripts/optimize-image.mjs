import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, dirname } from 'node:path';
import { chromium } from 'playwright-core';

const [inputPath, outputPath, widthValue = '1200', qualityValue = '0.82'] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  throw new Error('Usage: node scripts/optimize-image.mjs <input> <output.webp> [max-width] [quality]');
}

const mimeByExtension = new Map([
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
]);
const mime = mimeByExtension.get(extname(inputPath).toLowerCase());
if (!mime) throw new Error(`Unsupported input type: ${extname(inputPath)}`);

const maxWidth = Number.parseInt(widthValue, 10);
const quality = Number.parseFloat(qualityValue);
if (!Number.isFinite(maxWidth) || maxWidth < 320) throw new Error('max-width must be at least 320');
if (!Number.isFinite(quality) || quality <= 0 || quality > 1) throw new Error('quality must be between 0 and 1');

const input = await readFile(inputPath);
const dataUrl = `data:${mime};base64,${input.toString('base64')}`;
const executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = await chromium.launch({ executablePath, headless: true });

try {
  const page = await browser.newPage();
  const encoded = await page.evaluate(async ({ source, targetWidth, outputQuality }) => {
    const image = new Image();
    image.src = source;
    await image.decode();
    const width = Math.min(image.naturalWidth, targetWidth);
    const height = Math.round(image.naturalHeight * (width / image.naturalWidth));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Canvas 2D context unavailable');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, width, height);
    return { dataUrl: canvas.toDataURL('image/webp', outputQuality), width, height };
  }, { source: dataUrl, targetWidth: maxWidth, outputQuality: quality });

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, Buffer.from(encoded.dataUrl.split(',')[1], 'base64'));
  process.stdout.write(`${outputPath}\t${encoded.width}x${encoded.height}\n`);
} finally {
  await browser.close();
}
