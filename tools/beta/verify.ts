import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import {
  betaRelease,
  betaArchivePath,
  vueRuntimePackages,
} from "../release-channels";

const archive = resolve(betaArchivePath);
for (const version of ["3.5.44", betaRelease.vue]) {
  const root = resolve(
    "artifacts/packages",
    betaRelease.version,
    `consumer-vue-${version}`,
  );
  mkdirSync(resolve(root, "src"), { recursive: true });
  const registry = JSON.parse(
    readFileSync("apps/docs/public/beta/r/switch.json", "utf8"),
  );
  const dependencies: Record<string, string> = {
    "@orvui/vue": `file:${archive}`,
    vue: version,
    "@vue/server-renderer": version,
  };
  for (const dependency of registry.dependencies as string[]) {
    const at = dependency.lastIndexOf("@");
    dependencies[dependency.slice(0, at)] = dependency.slice(at + 1);
  }
  for (const file of registry.files) {
    const target = resolve(root, file.target.replace(/^~\//, ""));
    if (!target.startsWith(root + "/"))
      throw new Error("Invalid registry target");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content);
  }
  writeFileSync(
    resolve(root, "package.json"),
    JSON.stringify(
      {
        name: `orvui-beta-consumer-${version.replaceAll(".", "-")}`,
        private: true,
        type: "module",
        dependencies,
        devDependencies: {
          vite: "^7.0.0",
          "@vitejs/plugin-vue": "^6.0.0",
          typescript: "^5.8.0",
          "vue-tsc": "^3.0.0",
        },
        pnpm: {
          overrides: Object.fromEntries(
            vueRuntimePackages.map((name) => [name, version]),
          ),
        },
      },
      null,
      2,
    ),
  );
  writeFileSync(resolve(root, ".npmrc"), "auto-install-peers=true\n");
  writeFileSync(
    resolve(root, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        strict: true,
        skipLibCheck: true,
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        types: ["vite/client"],
      },
      include: ["src"],
    }),
  );
  writeFileSync(
    resolve(root, "index.html"),
    '<html lang="en"><head><title>orvui Beta consumer</title></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>',
  );
  writeFileSync(
    resolve(root, "vite.config.mjs"),
    "import { defineConfig } from 'vite'; import vue from '@vitejs/plugin-vue'; export default defineConfig({plugins:[vue()]});",
  );
  writeFileSync(
    resolve(root, "src/App.vue"),
    `<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@orvui/vue/motion/button';
import { Switch } from './components/orvui/motion/switch';
import '@orvui/vue/style.css';
const enabled = ref(false), count = ref(0);
</script>
<template><main><Button @click="count++">Count {{ count }}</Button><Switch v-model="enabled" label="Registry switch" /><output>{{ enabled ? 'Enabled' : 'Disabled' }}</output></main></template>`,
  );
  writeFileSync(
    resolve(root, "src/main.ts"),
    "import { createApp } from 'vue'; import App from './App.vue'; createApp(App).mount('#app');",
  );
  writeFileSync(
    resolve(root, "ssr.mjs"),
    `import assert from 'node:assert/strict';
import { createSSRApp, h, version } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { Button } from '@orvui/vue/motion/button';
import manifest from '@orvui/vue/package.json' with {type:'json'};
assert.equal(version, '${version}');
assert.equal(manifest.version, '${betaRelease.version}');
const first = await renderToString(createSSRApp({render:()=>h(Button, null, ()=> 'Beta consumer')}));
assert.match(first, /Beta consumer/);
assert.match(first, /<button/);
assert.equal(first, await renderToString(createSSRApp({render:()=>h(Button, null, ()=> 'Beta consumer')})));
console.log(JSON.stringify({vue:version, beta:manifest.version, ssr:'passed'}));`,
  );
  const run = (args: string[]) =>
    execFileSync("pnpm", ["--ignore-workspace", ...args], {
      cwd: root,
      stdio: "inherit",
    });
  run(["install", "--force"]);
  run(["exec", "vue-tsc", "--noEmit"]);
  run(["exec", "vite", "build"]);
  execFileSync(process.execPath, ["ssr.mjs"], { cwd: root, stdio: "inherit" });
}
