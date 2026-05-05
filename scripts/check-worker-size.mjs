import { gzipSync } from 'node:zlib';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const outputDir = '.open-next';
const workerEntry = join(outputDir, 'worker.js');
const assetDir = join(outputDir, 'assets');
const maxGzipBytes = Number(process.env.WORKER_SIZE_LIMIT_BYTES || 2_900_000);
const measuredExtensions = new Set(['.js', '.mjs', '.wasm']);

function walk(dir) {
  const entries = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      entries.push(...walk(fullPath));
      continue;
    }

    entries.push(fullPath);
  }

  return entries;
}

function hasMeasuredExtension(filePath) {
  return [...measuredExtensions].some((extension) => filePath.endsWith(extension));
}

if (!existsSync(outputDir)) {
  console.error(`OpenNext output not found at ${outputDir}. Run npm run cf:build first.`);
  process.exit(1);
}

if (!existsSync(workerEntry)) {
  console.error(`OpenNext worker entry not found at ${workerEntry}. Run a successful npm run cf:build first.`);
  process.exit(1);
}

const files = walk(outputDir)
  .filter((filePath) => !filePath.startsWith(assetDir))
  .filter(hasMeasuredExtension)
  .map((filePath) => {
    const contents = readFileSync(filePath);
    return {
      path: relative(process.cwd(), filePath),
      rawBytes: contents.byteLength,
      gzipBytes: gzipSync(contents).byteLength,
    };
  })
  .sort((left, right) => right.gzipBytes - left.gzipBytes);

const totalRawBytes = files.reduce((total, file) => total + file.rawBytes, 0);
const totalGzipBytes = files.reduce((total, file) => total + file.gzipBytes, 0);

console.log(`Worker raw size: ${(totalRawBytes / 1024).toFixed(2)} KiB`);
console.log(`Worker gzip size: ${(totalGzipBytes / 1024).toFixed(2)} KiB`);
console.log(`Worker gzip budget: ${(maxGzipBytes / 1024).toFixed(2)} KiB`);

for (const file of files.slice(0, 10)) {
  console.log(`${(file.gzipBytes / 1024).toFixed(2)} KiB gzip  ${file.path}`);
}

if (totalGzipBytes > maxGzipBytes) {
  console.error(`Worker gzip size exceeds budget by ${((totalGzipBytes - maxGzipBytes) / 1024).toFixed(2)} KiB.`);
  process.exit(1);
}
