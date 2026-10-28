import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizeRegistryOrigin, fixtureDirectory } from './metadata.mjs';

test('empty isolated registry origin chooses the packed local registry', () => {
  assert.equal(normalizeRegistryOrigin(undefined), undefined);
  assert.equal(normalizeRegistryOrigin(''), undefined);
  assert.equal(normalizeRegistryOrigin('  '), undefined);
  assert.equal(normalizeRegistryOrigin(' https://orvui.efu.me/ '), 'https://orvui.efu.me');
});

function archiveFromChild(environment = {}, args = []) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => !/^(ORVUI|IUI)_(PACKAGE_ARCHIVE|USAGE_PACKAGE)$/.test(name)));
  const source = `import {packageArchive} from ${JSON.stringify(new URL('./metadata.mjs', import.meta.url).href)}; console.log(packageArchive());`;
  return execFileSync(process.execPath, ['--input-type=module', '-e', source, '--', ...args], {
    env: { ...env, ...environment }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

test('archive selection preserves explicit arguments, environment precedence and legacy aliases', () => {
  const directory = fixtureDirectory('archive-selection-');
  const paths = ['explicit', 'current', 'legacy', 'usage'].map(name => join(directory, `${name}.tgz`));
  try {
    for (const path of paths) writeFileSync(path, 'archive selection fixture');
    const env = { ORVUI_PACKAGE_ARCHIVE: paths[1], IUI_PACKAGE_ARCHIVE: paths[2], ORVUI_USAGE_PACKAGE: paths[3] };
    assert.equal(archiveFromChild(env, ['--archive', paths[0]]), paths[0]);
    assert.equal(archiveFromChild(env), paths[1]);
    assert.equal(archiveFromChild({ IUI_PACKAGE_ARCHIVE: paths[2], ORVUI_USAGE_PACKAGE: paths[3] }), paths[2]);
    assert.equal(archiveFromChild({ ORVUI_USAGE_PACKAGE: paths[3] }), paths[3]);
    assert.equal(archiveFromChild({ IUI_USAGE_PACKAGE: paths[3] }), paths[3]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('a missing archive explains how to pack locally or supply an explicit archive', () => {
  const directory = fixtureDirectory('missing-archive-');
  try {
    assert.throws(() => archiveFromChild({}, ['--archive', join(directory, 'missing.tgz')]), error => {
      const message = error.stderr.toString();
      assert.match(message, /Missing package archive:/);
      assert.match(message, /pack --pack-destination/);
      assert.match(message, /artifacts\/packages\//);
      assert.match(message, /--archive \/absolute\/path\.tgz/);
      return true;
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
