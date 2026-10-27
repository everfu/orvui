import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

export const root = resolve(import.meta.dirname, '../..');
export const library = JSON.parse(readFileSync(join(root, 'packages/vue/package.json'), 'utf8'));
export const archiveName = `${library.name.replace(/^@/, '').replaceAll('/', '-')}-${library.version}.tgz`;
export const packageDirectory = join(root, 'artifacts/packages', library.version);

export function environment(name) {
  return process.env[`ORVUI_${name}`] ?? process.env[`IUI_${name}`];
}

function argument(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index < 0 ? undefined : process.argv[index + 1];
}

export function packageArchive() {
  const archive = resolve(argument('archive') ?? environment('PACKAGE_ARCHIVE') ?? environment('USAGE_PACKAGE') ?? join(packageDirectory, archiveName));
  if (!existsSync(archive)) throw new Error(`Missing package archive: ${archive}. Run pnpm --filter ${library.name} pack --pack-destination "${packageDirectory}", or provide --archive /absolute/path.tgz.`);
  return archive;
}

export function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

export function packedManifest(archive) {
  return JSON.parse(execFileSync('tar', ['-xOf', archive, 'package/package.json'], { encoding: 'utf8' }));
}

export function unpackArchive(archive) {
  const directory = mkdtempSync(join(tmpdir(), 'orvui-packed-'));
  const entries = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split('\n');
  for (const entry of entries) if (!entry.startsWith('package/') || entry.split('/').includes('..')) throw new Error(`Unsafe archive entry: ${entry}`);
  execFileSync('tar', ['-xzf', archive, '-C', directory]);
  return join(directory, 'package');
}

export function reportDirectory() {
  const directory = resolve(environment('VERIFICATION_DIR') ?? join(tmpdir(), 'orvui-verification'));
  mkdirSync(directory, { recursive: true });
  return directory;
}

export function normalizeRegistryOrigin(value) {
  return value?.trim().replace(/\/$/, '') || undefined;
}
