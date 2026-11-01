import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { betaRelease, betaArchiveName } from "../release-channels";
import { createRegistry, writeRegistryOutputs } from "../registry/build";

// Stage a separate package: never relabel or overwrite the stable manifest.
const destination = resolve("artifacts/packages", betaRelease.version);
const staging = resolve(destination, "package");
rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });
for (const name of ["dist", "src", "LICENSE", "NOTICE", "README.md"]) {
  const source = resolve("packages/vue", name);
  if (!existsSync(source)) throw new Error(`Missing package input: ${source}`);
  cpSync(source, resolve(staging, name), {
    recursive: true,
    filter: (path) => !path.split(/[\\/]/).includes("tests"),
  });
}
const manifest = JSON.parse(readFileSync("packages/vue/package.json", "utf8"));
manifest.version = betaRelease.version;
manifest.scripts = {};
manifest.devDependencies = {};
manifest.publishConfig = { ...manifest.publishConfig, tag: "beta" };
writeFileSync(
  resolve(staging, "package.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
const registry = createRegistry({ strict: true, channel: "beta" });
writeRegistryOutputs(registry.documents, [resolve(staging, "registry")]);
execFileSync("pnpm", ["pack", "--pack-destination", destination], {
  cwd: staging,
  stdio: "inherit",
});
if (!existsSync(resolve(destination, betaArchiveName)))
  throw new Error("Beta archive was not created");
console.log(
  `Local Beta: ${resolve(destination, betaArchiveName)} (Vue ${betaRelease.vue}; not published)`,
);
