import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { promisify } from "node:util";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { createServer } from "node:http";
import { fixtureDirectory, packageArchive, packedManifest, unpackArchive, environment, sha256, reportDirectory as getReportDirectory, normalizeRegistryOrigin } from "./verification/metadata.mjs";
const reportDirectory = getReportDirectory();
const archive = packageArchive();
const registryDirectory = resolve(environment("REGISTRY_DIRECTORY") ?? join(unpackArchive(archive), "registry"));

const installMode = environment("USAGE_INSTALL_MODE") ?? "cli";
const externalRegistryOrigin = normalizeRegistryOrigin(environment("REGISTRY_ORIGIN"));
if (!["cli", "manual"].includes(installMode))
  throw new Error(`Unsupported ORVUI_USAGE_INSTALL_MODE: ${installMode}`);
const reportName =
  installMode === "manual"
    ? "manual-usage-consumer"
    : "registry-usage-consumer";
const exec = promisify(execFile),
  root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  readFileSync(join(root, "tools/registry/public-usage.json"), "utf8"),
);
const workspace = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const library = packedManifest(archive);
const snippets = Object.values(manifest.files),
  slugs = [
    ...new Set(snippets.flatMap((snippet) => snippet.registryInstallSlugs)),
  ].sort();
const registry = new Map(
  slugs.map((slug) => [
    slug,
    readFileSync(join(registryDirectory, slug + ".json"), "utf8"),
  ]),
);
const packageName = (specifier) => {
  const versionAt = specifier.lastIndexOf("@");
  return versionAt > 0 ? specifier.slice(0, versionAt) : specifier;
};
for (const snippet of snippets) {
  if (!snippet.registryCode)
    throw new Error(`Missing registry code for ${snippet.file}`);
  const available = new Set(
    snippet.registryInstallSlugs.flatMap((slug) =>
      JSON.parse(registry.get(slug)).files.map((file) =>
        file.target?.replace(/^~\//, ""),
      ),
    ),
  );
  for (const target of snippet.registryTargets)
    if (!available.has(target))
      throw new Error(`Incomplete CLI closure for ${snippet.file}: ${target}`);
  const installedDependencies = new Set([
    "vue",
    ...snippet.registryInstallSlugs.flatMap((slug) =>
      (JSON.parse(registry.get(slug)).dependencies ?? []).map(packageName),
    ),
    ...snippet.registryExtraDependencies.map(packageName),
  ]);
  for (const dependency of snippet.dependencies)
    if (!installedDependencies.has(dependency))
      throw new Error(
        `Incomplete demo dependencies for ${snippet.file}: ${dependency}`,
      );
}
const directory = fixtureDirectory(`${installMode}-usage-consumer-`),
  log = [],
  failures = [];
function put(file, text) {
  const target = join(directory, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text);
}
// Also isolate self-contained fixtures placed under the project artifacts/.
put("pnpm-workspace.yaml", "packages:\n  - '.'\n");
async function command(args) {
  try {
    const { stdout, stderr } = await exec("pnpm", args, {
      cwd: directory,
      encoding: "utf8",
      maxBuffer: 60 * 1024 * 1024,
    });
    log.push(`$ pnpm ${args.join(" ")}\n${stdout}\n${stderr}`);
    return true;
  } catch (error) {
    const output = [error.stdout ?? "", error.stderr ?? "", String(error)].join(
      "\n",
    );
    log.push(`$ pnpm ${args.join(" ")}\n${output}`);
    failures.push({ command: args, output });
    return false;
  }
}
const dependencies = { vue: library.peerDependencies.vue };
const copiedFiles = new Map();
const licenseFiles = new Map();
for (const slug of slugs)
  for (const file of JSON.parse(registry.get(slug)).files)
    if (/\/(?:LICENSE|NOTICE)(?:[.-][^/]*)?\.txt$/.test(file.target))
      licenseFiles.set(file.target.replace(/^~\//, ""), file.content);
if (installMode === "manual")
  for (const slug of slugs) {
    const item = JSON.parse(registry.get(slug));
    for (const specifier of item.dependencies ?? []) {
      const name = packageName(specifier);
      const version = specifier.slice(name.length + 1);
      if (!version)
        throw new Error(`Unversioned registry dependency: ${specifier}`);
      if (dependencies[name] && dependencies[name] !== version)
        throw new Error(`Conflicting registry dependency for ${name}`);
      dependencies[name] = version;
    }
    for (const file of item.files) {
      if (!file.target?.startsWith("~/") || typeof file.content !== "string")
        throw new Error(
          `Missing portable registry source target for ${slug}: ${file.path}`,
        );
      const target = file.target.replace(/^~\//, "");
      const destination = resolve(directory, target);
      if (relative(directory, destination).startsWith(".."))
        throw new Error(`Registry copy target escapes fixture: ${file.target}`);
      if (copiedFiles.has(target) && copiedFiles.get(target) !== file.content)
        throw new Error(`Conflicting registry source contents for ${target}`);
      copiedFiles.set(target, file.content);
    }
  }
for (const specifier of new Set(
  snippets.flatMap((snippet) => snippet.registryExtraDependencies),
)) {
  const dependency = packageName(specifier);
  dependencies[dependency] =
    library.dependencies[dependency] ??
    library.peerDependencies[dependency] ??
    workspace.devDependencies[dependency];
  if (!dependencies[dependency])
    throw new Error(`Undeclared demo dependency: ${dependency}`);
}
put(
  "package.json",
  JSON.stringify(
    {
      name: `orvui-${installMode}-usage-consumer`,
      private: true,
      type: "module",
      packageManager: workspace.packageManager,
      dependencies,
      devDependencies: {
        ...Object.fromEntries(
          ["vite", "@vitejs/plugin-vue", "typescript", "vue-tsc"].map(
            (name) => [name, workspace.devDependencies[name]],
          ),
        ),
        tailwindcss: "^4.0.0",
        "@tailwindcss/vite": "^4.0.0",
      },
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
        baseUrl: ".",
        paths: { "@/*": ["src/*"] },
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
  "components.json",
  JSON.stringify(
    {
      $schema: "https://shadcn-vue.com/schema.json",
      style: "new-york",
      typescript: true,
      tailwind: {
        css: "src/style.css",
        // orvui supplies its own complete palette; no shadcn color preset is needed.
        baseColor: "",
        cssVariables: true,
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        composables: "@/composables",
      },
    },
    null,
    2,
  ),
);
put("src/style.css", '@import "tailwindcss";\n');
put(
  "index.html",
  '<html><head><meta charset="UTF-8"></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>',
);
put(
  "vite.config.ts",
  `import {defineConfig} from 'vite';import vue from '@vitejs/plugin-vue';import tailwind from '@tailwindcss/vite';import{fileURLToPath,URL}from'node:url';export default defineConfig({plugins:[vue(),tailwind(),{name:'registry-usage-runtime-audit',generateBundle(){for(const id of this.getModuleIds()){if(id.includes(${JSON.stringify(join(root, "packages/vue/src"))}))throw new Error('Consumer resolved workspace source: '+id);if(['/node_modules/@orvui/vue/','/node_modules/react/','/node_modules/react-dom/','/node_modules/next/'].some(part=>id.includes(part)))throw new Error('Unexpected package/React/Next runtime: '+id)}}}],resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url))}}})`,
);
for (const snippet of snippets)
  put(
    "src/examples/" + snippet.file.replace(/^packages\/vue\/src\//, ""),
    snippet.registryCode,
  );
put(
  "src/main.ts",
  `import{createApp,h,type Component}from'vue';import'./style.css';const examples=import.meta.glob('./examples/**/*.vue',{eager:true,import:'default'});createApp({render:()=>h('main',Object.entries(examples).map(([name,component])=>h('section',{key:name},[h('h2',name),h(component as Component)])))}).mount('#app')`,
);
const server = createServer((request, response) => {
  const match = /^\/r\/([a-z0-9-]+)\.json$/.exec(
      new URL(request.url ?? "/", "http://localhost").pathname,
    ),
    content = match && registry.get(match[1]);
  if (!content) {
    response.writeHead(404);
    response.end("Registry item unavailable");
    return;
  }
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(content);
});
if (installMode === "cli" && !externalRegistryOrigin)
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin =
  installMode === "cli" ? (externalRegistryOrigin ?? `http://127.0.0.1:${server.address().port}`) : null;
let installed = false,
  cliPassed = installMode === "cli" ? false : null,
  manualCopyPassed = false,
  targetsVerified = false,
  licenseTextsVerified = false,
  installedLicenseHashes = [],
  typesPassed = false,
  buildPassed = false;
try {
  if (installMode === "manual") {
    for (const [target, content] of copiedFiles) put(target, content);
    manualCopyPassed = true;
    log.push(
      `Copied ${copiedFiles.size} source files directly from ${slugs.length} local registry JSON snapshots.`,
    );
  }
  installed = await command([
    "install",
    "--no-frozen-lockfile",
    "--prefer-offline",
  ]);
  if (installed && installMode === "cli")
    cliPassed = await command([
      "dlx",
      "shadcn-vue@2.8.2",
      "add",
      ...slugs.map((slug) => `${origin}/r/${slug}.json`),
      "--yes",
      "--overwrite",
    ]);
  if (installed && (cliPassed || manualCopyPassed)) {
    if (installMode === "manual")
      for (const [target, content] of copiedFiles)
        if (readFileSync(join(directory, target), "utf8") !== content)
          throw new Error(
            `Manual copy changed registry source contents: ${target}`,
          );
    for (const snippet of snippets)
      for (const target of snippet.registryTargets)
        if (!existsSync(join(directory, target)))
          throw new Error(
            `${installMode} did not install promised target ${target} for ${snippet.file}`,
          );
    for (const [target, content] of licenseFiles) {
      const actual = readFileSync(join(directory, target));
      const expected = Buffer.from(content, "utf8");
      if (!actual.equals(expected))
        throw new Error(`${installMode} changed license text: ${target}`);
      installedLicenseHashes.push({ target, bytes: actual.length, sha256: createHash("sha256").update(actual).digest("hex") });
    }
    if (!licenseFiles.size) throw new Error("No source license texts were collected");
    licenseTextsVerified = true;
    targetsVerified = true;
    put("src/style.css", '@import "./components/orvui/styles.css";\n');
    typesPassed = await command(["exec", "vue-tsc", "--noEmit"]);
    buildPassed = await command(["exec", "vite", "build"]);
  }
} catch (error) {
  failures.push({ command: ["installed-target-audit"], output: String(error) });
} finally {
  if (installMode === "cli" && !externalRegistryOrigin)
    await new Promise((resolve) => server.close(resolve));
}
const result = {
  result:
    installed &&
    (cliPassed || manualCopyPassed) &&
    targetsVerified &&
    licenseTextsVerified &&
    typesPassed &&
    buildPassed
      ? "passed"
      : "failed",
  directory,
  installMode,
  copiedSourceFiles: copiedFiles.size,
  archive,
  sha256: sha256(archive),
  registrySnapshotDirectory: registryDirectory,
  registryOrigin: origin,
  registrySnapshotItems: slugs.length,
  installedRegistrySlugs: slugs,
  checkedDefaultEntries: manifest.summary.entries,
  checkedRegisteredVariants: manifest.summary.variants,
  checkedUsageFiles: snippets.length,
  directDemoDependencies: Object.keys(dependencies),
  perExampleDependenciesVerified: true,
  installed,
  cliPassed,
  manualCopyPassed,
  targetsVerified,
  licenseTextsVerified,
  checkedLicenseFiles: licenseFiles.size,
  installedLicenseHashes,
  typesPassed,
  buildPassed,
  failures,
};
mkdirSync(reportDirectory, { recursive: true });
writeFileSync(
  join(reportDirectory, `${reportName}.json`),
  JSON.stringify(result, null, 2) + "\n",
);
writeFileSync(join(reportDirectory, `${reportName}.log`), log.join("\n"));
console.log(
  JSON.stringify(
    {
      ...result,
      failures: failures.map((failure) => ({
        command: failure.command[0],
        output: join(reportDirectory, `${reportName}.log`),
      })),
    },
    null,
    2,
  ),
);
if (result.result !== "passed") process.exitCode = 1;
