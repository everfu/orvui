import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = fileURLToPath(new URL("../../", import.meta.url));
const source = resolve(root, "assets/brand");
const publicDir = resolve(root, "apps/docs/public");
const files = [
  "logo-mark.svg",
  "logo-mark-white.svg",
  "logo-horizontal.svg",
  "logo-horizontal-white.svg",
  "favicon.svg",
];
const outputs = files.map((name) => [name, resolve(publicDir, "brand", name)]);
outputs.push(
  ["favicon.svg", resolve(publicDir, "favicon.svg")],
  ["favicon.svg", resolve(root, "assets/readme-logo.svg")],
);
for (const [name, destination] of outputs) {
  const bytes = await readFile(resolve(source, name));
  const previous = await readFile(destination).catch((error) => {
    if (error.code !== "ENOENT") throw error;
    return null;
  });
  if (previous?.equals(bytes)) continue;
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
}
console.log("Synced selected orvui identity to documentation, favicon and README assets.");
