import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fixtureDirectory, packageArchive, packedManifest, sha256, reportDirectory as getReportDirectory } from "./verification/metadata.mjs";
const reportDirectory = getReportDirectory();

const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  readFileSync(join(root, "tools/registry/public-usage.json"), "utf8"),
);
const archive = packageArchive();
const library = packedManifest(archive);
const workspace = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const directory = fixtureDirectory("public-usage-consumer-");
const log = [],
  failures = [];
function put(file, text) {
  const target = join(directory, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text);
}
function command(args) {
  try {
    const text = execFileSync("pnpm", args, {
      cwd: directory,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 30 * 1024 * 1024,
    });
    log.push(`$ pnpm ${args.join(" ")}\n${text}`);
    return true;
  } catch (error) {
    const text = [
      error.stdout?.toString() ?? "",
      error.stderr?.toString() ?? "",
      String(error),
    ].join("\n");
    log.push(`$ pnpm ${args.join(" ")}\n${text}`);
    failures.push({ command: args, output: text });
    return false;
  }
}
const dependencies = { [library.name]: `file:${archive}` };
for (const dependency of new Set(
  Object.values(manifest.files).flatMap((snippet) => snippet.dependencies),
)) {
  const version =
    library.dependencies[dependency] ??
    library.peerDependencies[dependency] ??
    workspace.devDependencies[dependency];
  if (!version)
    throw new Error(`No declared version for example dependency ${dependency}`);
  dependencies[dependency] = version;
}
put("pnpm-workspace.yaml", "packages:\n  - '.'\n");
put(
  "package.json",
  JSON.stringify(
    {
      name: "orvui-public-usage-consumer",
      private: true,
      type: "module",
      packageManager: workspace.packageManager,
      dependencies,
      devDependencies: Object.fromEntries(
        ["vite", "@vitejs/plugin-vue", "typescript", "vue-tsc"].map((name) => [
          name,
          workspace.devDependencies[name],
        ]),
      ),
    },
    null,
    2,
  ),
);
put(
  "tsconfig.json",
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        strict: true,
        skipLibCheck: true,
        noUncheckedSideEffectImports: true,
        types: ["vite/client"],
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        jsx: "preserve",
        allowSyntheticDefaultImports: true,
      },
      include: ["src"],
    },
    null,
    2,
  ),
);
put(
  "index.html",
  '<html><head><meta charset="UTF-8"></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>',
);
put(
  "vite.config.ts",
  `import {defineConfig} from 'vite';import vue from '@vitejs/plugin-vue';export default defineConfig({plugins:[vue(),{name:'public-usage-runtime-audit',generateBundle(){for(const id of this.getModuleIds()){if(id.includes(${JSON.stringify(join(root, "packages/vue/src"))}))throw new Error('Consumer resolved workspace source: '+id);if(['/node_modules/react/','/node_modules/react-dom/','/node_modules/next/'].some(part=>id.includes(part)))throw new Error('Unexpected React/Next runtime: '+id)}}}]})`,
);
for (const snippet of Object.values(manifest.files))
  put(
    "src/examples/" + snippet.file.replace(/^packages\/vue\/src\//, ""),
    snippet.code,
  );
put(
  "src/main.ts",
  `import {createApp,h,type Component} from 'vue';import '@orvui/vue/style.css';const examples=import.meta.glob('./examples/**/*.vue',{eager:true,import:'default'});createApp({render:()=>h('main',Object.entries(examples).map(([name,component])=>h('section',{key:name},[h('h2',name),h(component as Component)])))}).mount('#app')`,
);
const installed = command([
  "install",
  "--no-frozen-lockfile",
  "--prefer-offline",
]);
let typesPassed = false,
  buildPassed = false;
if (installed) {
  typesPassed = command(["exec", "vue-tsc", "--noEmit"]);
  buildPassed = command(["exec", "vite", "build"]);
}
const result = {
  result: installed && typesPassed && buildPassed ? "passed" : "failed",
  directory,
  archive,
  sha256: sha256(archive),
  checkedDefaultEntries: manifest.summary.entries,
  checkedRegisteredVariants: manifest.summary.variants,
  checkedUsageFiles: Object.keys(manifest.files).length,
  directDependencies: dependencies,
  installed,
  typesPassed,
  buildPassed,
  failures,
};
mkdirSync(reportDirectory, { recursive: true });
writeFileSync(
  join(reportDirectory, "public-usage-consumer.json"),
  JSON.stringify(result, null, 2) + "\n",
);
writeFileSync(join(reportDirectory, "public-usage-consumer.log"), log.join("\n"));
console.log(
  JSON.stringify(
    {
      ...result,
      failures: failures.map((failure) => ({
        command: failure.command,
        output: join(reportDirectory, "public-usage-consumer.log"),
      })),
    },
    null,
    2,
  ),
);
if (result.result !== "passed") process.exitCode = 1;
