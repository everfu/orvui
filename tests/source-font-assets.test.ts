import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";
import manifest from "../apps/docs/public/fonts/source/provenance.json";
const checksum = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const fontDirectory = resolve("apps/docs/public/fonts/source");
it("serves complete unchanged WOFF2 files from the declared font packages", () => {
  expect(manifest.schemaVersion).toBe(2);
  expect(manifest.assetCount).toBe(manifest.assets.length);
  expect(readdirSync(fontDirectory).filter(name => name.endsWith(".woff2")).sort()).toEqual(manifest.assets.map(asset => asset.file).sort());
  for (const asset of manifest.assets) {
    const bytes = readFileSync(resolve(fontDirectory, asset.file));
    const original = readFileSync(resolve("apps/docs/node_modules", asset.package, asset.packageFile));
    expect(bytes.toString("ascii", 0, 4)).toBe("wOF2");
    expect(bytes.readUInt32BE(8)).toBe(bytes.length);
    expect(bytes.length).toBe(asset.size);
    expect(checksum(bytes)).toBe(asset.sha256);
    expect(bytes.equals(original)).toBe(true);
  }
  expect(manifest.assets.reduce((size, asset) => size + asset.size, 0)).toBe(manifest.totalBytes);
});
it("provides both font families at every documented weight without remote requests", () => {
  const css = readFileSync("apps/docs/.vitepress/theme/fonts.css", "utf8");
  expect(css.match(/@font-face/g)).toHaveLength(manifest.assetCount);
  expect(css).not.toMatch(/url\(["']?https?:/);
  for (const asset of manifest.assets) expect(css).toContain(`/fonts/source/${asset.file}`);
  for (const family of ["Geist", "Geist Mono"]) expect([...new Set(manifest.assets.filter(asset => asset.family === family).map(asset => asset.weight))].sort((a,b)=>a-b)).toEqual([100,200,300,400,500,600,700,800,900]);
});
it("retains the actual package font licenses and checksums", () => {
  for (const license of manifest.licenses) {
    const bytes = readFileSync(resolve("apps/docs/public", "." + license.path));
    expect(bytes.equals(readFileSync(resolve("apps/docs/node_modules", license.package, "LICENSE")))).toBe(true);
    expect(checksum(bytes)).toBe(license.sha256);
    expect(bytes.toString()).toContain("SIL OPEN FONT LICENSE");
    expect(bytes.toString()).toContain("Geist Project Authors");
  }
});
