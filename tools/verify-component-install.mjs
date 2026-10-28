import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import {
  root, fixtureDirectory, packageArchive, packedManifest, unpackArchive, environment, sha256,
  reportDirectory as getReportDirectory,
} from './verification/metadata.mjs';

// This fixture installs one component from the packed registry. It never installs the library package.
const archive = packageArchive(), archiveHash = sha256(archive), library = packedManifest(archive);
const registryDirectory = resolve(environment('REGISTRY_DIRECTORY') ?? join(unpackArchive(archive), 'registry'));
const externalRegistryOrigin = environment('REGISTRY_ORIGIN')?.trim().replace(/\/+$/, '') || undefined;
if (externalRegistryOrigin && !/^https?:\/\/[^/?#]+$/.test(externalRegistryOrigin))
  throw new Error('ORVUI_REGISTRY_ORIGIN must be an HTTP(S) origin without a path, query or fragment');
const reportDirectory = getReportDirectory();
mkdirSync(reportDirectory, { recursive: true });
const reportName = externalRegistryOrigin ? 'public-component-install-consumer' : 'component-install-consumer';
const directory = fixtureDirectory('component-install-consumer-');
const workspace = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const registryContent = readFileSync(join(registryDirectory, 'button.json'), 'utf8');
const previousDirectory = environment('PREVIOUS_REGISTRY_DIRECTORY');
const previousContent = previousDirectory ? readFileSync(join(resolve(previousDirectory), 'button.json'), 'utf8') : undefined;
if (previousContent && externalRegistryOrigin)
  throw new Error('Previous source installation verification requires the local registry server');
let upgradeVerified = previousContent ? false : null;
const item = JSON.parse(registryContent), exec = promisify(execFile);
const log = [], failures = [], registryRequests = [];
const installedFiles = [], installedLicenseHashes = [];
let expectedFiles = [], expectedDependencies = [], installedDependencies = [], installedDevDependencies = [];
let installed = false, cliPassed = false, filesVerified = false, dependencyScopeVerified = false;
let licenseTextsVerified = false, typesPassed = false, buildPassed = false;
let publicSnapshotVerified = externalRegistryOrigin ? false : null, publicRegistrySha256;
let origin;

function put(path, content) {
  const target = resolve(directory, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}
async function command(args) {
  const label = `$ pnpm ${args.join(' ')}`;
  try {
    const { stdout, stderr } = await exec('pnpm', args, {
      cwd: directory, encoding: 'utf8', maxBuffer: 30 * 1024 * 1024, timeout: 300_000,
      env: { ...process.env, CI: 'true' },
    });
    log.push(`${label}\n${stdout}\n${stderr}`);
    return true;
  } catch (error) {
    const output = [error.stdout ?? '', error.stderr ?? '', String(error)].join('\n');
    log.push(`${label}\n${output}`);
    failures.push({ command: args, output });
    return false;
  }
}
function listFiles(path) {
  if (!existsSync(path)) return [];
  return readdirSync(path).flatMap((name) => {
    const location = join(path, name), stat = lstatSync(location);
    if (stat.isSymbolicLink()) throw new Error(`Unexpected symlink in installed sources: ${location}`);
    return stat.isDirectory() ? listFiles(location) : [relative(directory, location).replaceAll('\\', '/')];
  }).sort();
}
function dependencyName(specifier) {
  const version = specifier.lastIndexOf('@');
  if (version <= 0) throw new Error(`Registry dependency must be versioned: ${specifier}`);
  return specifier.slice(0, version);
}
function assertSameSet(actual, expected, label) {
  const missing = expected.filter((name) => !actual.includes(name));
  const extra = actual.filter((name) => !expected.includes(name));
  if (missing.length || extra.length)
    throw new Error(`${label}: missing [${missing.join(', ')}], unexpected [${extra.join(', ')}]`);
}
const baseDependencies = { vue: library.peerDependencies.vue };
const baseDevDependencies = {
  ...Object.fromEntries(['vite', '@vitejs/plugin-vue', 'typescript', 'vue-tsc']
    .map((name) => [name, workspace.devDependencies[name]])),
  tailwindcss: '^4.0.0', '@tailwindcss/vite': '^4.0.0',
};
put('pnpm-workspace.yaml', "packages:\n  - '.'\n");
put('package.json', JSON.stringify({ name: 'orvui-single-component-consumer', private: true,
  type: 'module', packageManager: workspace.packageManager,
  dependencies: baseDependencies, devDependencies: baseDevDependencies }, null, 2));
put('index.html', '<html><head><meta charset="UTF-8"></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>');
put('tsconfig.json', JSON.stringify({ compilerOptions: {
  baseUrl: '.', paths: { '@/*': ['src/*'] }, target: 'ES2022', module: 'ESNext',
  moduleResolution: 'Bundler', strict: true, skipLibCheck: true,
  noUncheckedSideEffectImports: true, types: ['vite/client'], lib: ['ES2022', 'DOM', 'DOM.Iterable'],
  jsx: 'preserve', allowSyntheticDefaultImports: true,
}, include: ['src'] }, null, 2));
// The copied orvui theme owns its palette; no upstream shadcn base-color transformation is needed.
put('components.json', JSON.stringify({ $schema: 'https://shadcn-vue.com/schema.json', style: 'new-york',
  typescript: true, tailwind: { css: 'src/style.css', baseColor: '', cssVariables: true },
  aliases: { components: '@/components', utils: '@/lib/utils', ui: '@/components/ui', lib: '@/lib', composables: '@/composables' },
}, null, 2));
put('src/style.css', '@import "tailwindcss";\n');
put('src/App.vue', `<script setup lang="ts">\nimport { ref } from 'vue';\nimport { Button } from './components/orvui/motion/button';\nconst clicks = ref(0);\n</script>\n<template><Button variant="primary" :disabled="false" @click="clicks++">Continue {{ clicks }}</Button></template>\n`);
put('src/contracts.ts', `import type { ButtonProps } from './components/orvui/motion/button';\nconst valid: ButtonProps = { disabled: false };\n// @ts-expect-error Button disabled accepts a Boolean.\nconst invalid: ButtonProps = { disabled: 'yes' };\nvoid [valid, invalid];\n`);
put('src/main.ts', "import { createApp } from 'vue';\nimport App from './App.vue';\nimport './style.css';\ncreateApp(App).mount('#app');\n");
put('vite.config.ts', `import { defineConfig } from 'vite';\nimport vue from '@vitejs/plugin-vue';\nimport tailwind from '@tailwindcss/vite';\nimport { fileURLToPath, URL } from 'node:url';\nexport default defineConfig({plugins:[vue(),tailwind(),{name:'single-component-runtime-audit',generateBundle(){for(const id of this.getModuleIds()){if(id.includes(${JSON.stringify(join(root, 'packages/vue/src'))}))throw new Error('Consumer resolved workspace source: '+id);if(['/node_modules/@orvui/vue/','/node_modules/react/','/node_modules/react-dom/','/node_modules/next/','/node_modules/shiki/','/node_modules/lenis/','/node_modules/@paper-design/shaders/','/node_modules/@tanstack/vue-virtual/'].some(part=>id.includes(part)))throw new Error('Unexpected library or feature runtime: '+id)}}}],resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url))}}});\n`);
const server = createServer((request, response) => {
  const path = new URL(request.url ?? '/', 'http://localhost').pathname;
  registryRequests.push(path);
  if (path === '/previous/button.json' && previousContent) {
    response.writeHead(200, { 'Content-Type': 'application/json' }); response.end(previousContent); return;
  }
  if (path !== '/r/button.json') {
    response.writeHead(404); response.end('Only the selected component is available'); return;
  }
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(registryContent);
});
try {
  if (item.name !== 'button' || !Array.isArray(item.files) || !item.files.length
    || (item.registryDependencies?.length ?? 0) > 0)
    throw new Error('Expected one self-contained button registry item');
  const expected = new Map();
  for (const file of item.files) {
    if (!file.target?.startsWith('~/src/components/orvui/') || typeof file.content !== 'string')
      throw new Error(`Non-portable component source target: ${file.target}`);
    const target = file.target.slice(2), location = resolve(directory, target);
    if (relative(directory, location).startsWith('..') || target.includes('\\')
      || target.split('/').some((part) => part === '.' || part === '..' || !part))
      throw new Error(`Component target escapes fixture: ${file.target}`);
    const source = target.replace('src/components/orvui/', '');
    if (!(source.startsWith('motion/button/') || source.startsWith('lib/')
      || ['styles.css', 'tokens.css', 'LICENSE.txt', 'NOTICE.txt'].includes(source)))
      throw new Error(`Unrelated source in button closure: ${source}`);
    if (/(?:^|\/)(?:demo\.vue|examples\/|tests\/)/.test(source))
      throw new Error(`Non-runtime source in button closure: ${source}`);
    if (expected.has(target)) throw new Error(`Duplicate component target: ${target}`);
    expected.set(target, file.content);
  }
  expectedFiles = [...expected.keys()].sort();
  const componentDependencies = (item.dependencies ?? []).map(dependencyName);
  const allowedComponentDependencies = ['clsx', 'lucide-vue-next', 'motion-v', 'tailwind-merge', 'tailwindcss'];
  assertSameSet(componentDependencies, allowedComponentDependencies, 'Button dependency closure');
  expectedDependencies = [...new Set([
    ...Object.keys(baseDependencies), ...Object.keys(baseDevDependencies), ...componentDependencies,
  ])].sort();
  if (externalRegistryOrigin) {
    origin = externalRegistryOrigin;
    const response = await fetch(`${origin}/r/button.json`, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Public button registry returned HTTP ${response.status}`);
    const publicBytes = Buffer.from(await response.arrayBuffer());
    if (!publicBytes.equals(Buffer.from(registryContent, 'utf8')))
      throw new Error('Public button registry does not match the packed registry snapshot byte for byte');
    publicRegistrySha256 = createHash('sha256').update(publicBytes).digest('hex');
    publicSnapshotVerified = true;
    log.push(`Verified public registry bytes against packed snapshot: ${origin}/r/button.json`);
  } else {
    await new Promise((listen) => server.listen(0, '127.0.0.1', listen));
    origin = `http://127.0.0.1:${server.address().port}`;
  }
  installed = await command(['install', '--no-frozen-lockfile', '--prefer-offline']);
  if (installed) cliPassed = await command(['dlx', 'shadcn-vue@2.8.2', 'add', `${origin}/r/button.json`, '--yes', '--overwrite']);
  if (installed && cliPassed) {
    installedFiles.push(...listFiles(join(directory, 'src/components')));
    assertSameSet(installedFiles, expectedFiles, 'Installed component source closure');
    // The installer must not copy helpers outside the published component namespace.
    const unexpectedSource = listFiles(join(directory, 'src')).filter((path) =>
      !expected.has(path) && !['src/App.vue', 'src/contracts.ts', 'src/main.ts', 'src/style.css'].includes(path));
    if (unexpectedSource.length) throw new Error(`Unexpected source outside component closure: ${unexpectedSource.join(', ')}`);
    filesVerified = true;
    const consumer = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'));
    installedDependencies = Object.keys(consumer.dependencies ?? {}).sort();
    installedDevDependencies = Object.keys(consumer.devDependencies ?? {}).sort();
    assertSameSet([...new Set([...installedDependencies, ...installedDevDependencies])].sort(), expectedDependencies,
      'Installed direct dependency scope');
    if (existsSync(join(directory, 'node_modules/@orvui/vue')))
      throw new Error('Source installation unexpectedly installed the whole library package');
    dependencyScopeVerified = true;
    for (const [target, content] of expected) if (/\/(?:LICENSE|NOTICE)(?:[.-][^/]*)?\.txt$/.test(target)) {
      const actual = readFileSync(join(directory, target));
      if (!actual.equals(Buffer.from(content, 'utf8'))) throw new Error(`CLI changed license bytes: ${target}`);
      installedLicenseHashes.push({ target, bytes: actual.length, sha256: createHash('sha256').update(actual).digest('hex') });
    }
    if (installedLicenseHashes.length !== 2) throw new Error('Button source installation must retain LICENSE and NOTICE');
    licenseTextsVerified = true;
    put('src/style.css', '@import "./components/orvui/styles.css";\n');
    typesPassed = await command(['exec', 'vue-tsc', '--noEmit']);
    buildPassed = await command(['exec', 'vite', 'build']);
    if (typesPassed && buildPassed && previousContent) {
      // This is an isolated generated fixture, never a user's source directory.
      rmSync(join(directory, 'src/components'), { recursive: true, force: true });
      const previousPassed = await command(['dlx', 'shadcn-vue@2.8.2', 'add', `${origin}/previous/button.json`, '--yes', '--overwrite']);
      if (!previousPassed) throw new Error('Previous registry CLI installation failed');
      if (!await command(['exec', 'vue-tsc', '--noEmit']) || !await command(['exec', 'vite', 'build']))
        throw new Error('Previous source installation does not compile');
      const stale = new Map(JSON.parse(previousContent).files
        .filter(file => !expected.has(file.target.slice(2)))
        .map(file => [file.target.slice(2), readFileSync(join(directory, file.target.slice(2)), 'utf8')]));
      const custom = 'src/components/orvui/local-note.txt';
      put(custom, 'Consumer customization must survive registry updates.\n');
      if (!await command(['dlx', 'shadcn-vue@2.8.2', 'add', `${origin}/r/button.json`, '--yes', '--overwrite']))
        throw new Error('Source registry update failed');
      for (const [target, content] of [...expected, ...stale])
        if (readFileSync(join(directory, target), 'utf8') !== content)
          throw new Error(`Updated source or retained old file differs: ${target}`);
      if (readFileSync(join(directory, custom), 'utf8') !== 'Consumer customization must survive registry updates.\n')
        throw new Error('Source update changed consumer customization');
      upgradeVerified = await command(['exec', 'vue-tsc', '--noEmit']) && await command(['exec', 'vite', 'build']);
    }
  }
} catch (error) {
  failures.push({ command: ['single-component-audit'], output: String(error) });
  log.push(String(error));
} finally {
  if (server.listening) await new Promise((close) => server.close(close));
  const archiveUnchanged = existsSync(archive) && sha256(archive) === archiveHash;
  if (!archiveUnchanged) failures.push({ command: ['artifact-identity'], output: 'Archive changed while its component installation was being verified' });
  const result = {
    result: installed && cliPassed && filesVerified && dependencyScopeVerified && licenseTextsVerified
      && typesPassed && buildPassed && archiveUnchanged
      && upgradeVerified !== false
      && (!externalRegistryOrigin || publicSnapshotVerified) ? 'passed' : 'failed',
    archive, sha256: archiveHash, archiveUnchanged, directory, registrySnapshotDirectory: registryDirectory,
    registryOrigin: origin, registryRequests, publicSnapshotVerified, publicRegistrySha256,
    installedRegistrySlugs: ['button'],
    cliVersion: '2.8.2', installed, cliPassed, filesVerified, dependencyScopeVerified, licenseTextsVerified, upgradeVerified,
    installedFiles, expectedFiles, expectedDependencies, installedDependencies, installedDevDependencies,
    checkedLicenseFiles: installedLicenseHashes.length, installedLicenseHashes, typesPassed, buildPassed, failures,
  };
  writeFileSync(join(reportDirectory, `${reportName}.json`), JSON.stringify(result, null, 2) + '\n');
  writeFileSync(join(reportDirectory, `${reportName}.log`), log.join('\n'));
  console.log(JSON.stringify({ ...result, failures: failures.map((failure) => ({
    command: failure.command[0], output: join(reportDirectory, `${reportName}.log`),
  })) }, null, 2));
  if (result.result !== 'passed') process.exitCode = 1;
}
