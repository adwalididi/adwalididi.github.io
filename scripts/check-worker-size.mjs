import { existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const outputDir = '.open-next';
const workerEntry = join(outputDir, 'worker.js');
const wranglerOutDir = '.wrangler-bundle-size';
const maxGzipBytes = Number(process.env.WORKER_SIZE_LIMIT_BYTES || 2_900_000);

if (!existsSync(outputDir)) {
  console.error(`OpenNext output not found at ${outputDir}. Run npm run cf:build first.`);
  process.exit(1);
}

if (!existsSync(workerEntry)) {
  console.error(`OpenNext worker entry not found at ${workerEntry}. Run a successful npm run cf:build first.`);
  process.exit(1);
}

rmSync(wranglerOutDir, { recursive: true, force: true });

const wranglerArgs = ['wrangler', 'deploy', '--config', 'wrangler.worker.jsonc', '--dry-run', '--outdir', wranglerOutDir];
const command = process.platform === 'win32' ? 'cmd' : 'npx';
const args = process.platform === 'win32' ? ['/c', 'npx', ...wranglerArgs] : wranglerArgs;
const result = spawnSync(command, args, { encoding: 'utf8' });

const output = `${result.stdout || ''}\n${result.stderr || ''}`;
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status || 1);
}

const match = output.match(/Total Upload:\s+([\d.]+)\s+KiB\s+\/\s+gzip:\s+([\d.]+)\s+KiB/i);
if (!match) {
  console.error('Could not parse Wrangler dry-run upload size.');
  process.exit(1);
}

const totalRawBytes = Number(match[1]) * 1024;
const totalGzipBytes = Number(match[2]) * 1024;

console.log(`Worker raw upload: ${(totalRawBytes / 1024).toFixed(2)} KiB`);
console.log(`Worker gzip upload: ${(totalGzipBytes / 1024).toFixed(2)} KiB`);
console.log(`Worker gzip budget: ${(maxGzipBytes / 1024).toFixed(2)} KiB`);

rmSync(wranglerOutDir, { recursive: true, force: true });

if (totalGzipBytes > maxGzipBytes) {
  console.error(`Worker gzip upload exceeds budget by ${((totalGzipBytes - maxGzipBytes) / 1024).toFixed(2)} KiB.`);
  process.exit(1);
}
