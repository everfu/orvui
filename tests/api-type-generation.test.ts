// @vitest-environment node
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, it } from "vitest";

it("generates public prop types relative to the relocated implementation rather than the barrel", () => {
  const directory = mkdtempSync(join(tmpdir(), "orvui-api-type-layout-"));
  const folder = join(directory, "packages/vue/src/motion/button");
  try {
    mkdirSync(join(folder, "src"), { recursive: true });
    writeFileSync(join(folder, "index.ts"), 'export { default as Button } from "./src/Button.vue";\nexport type * from "./src/api-types";\n');
    writeFileSync(join(folder, "src/Button.vue"), '<template><button><slot /></button></template>');
    writeFileSync(join(folder, "src/api-types.ts"), 'export type ButtonProps = never;');
    const require = createRequire(import.meta.url);
    const generate = () => execFileSync(process.execPath, [require.resolve("tsx/cli"), resolve("tools/registry/api-types.ts")], { cwd: directory });
    generate();
    const generated = readFileSync(join(folder, "src/api-types.ts"), "utf8");
    expect(generated).toContain("InstanceType<typeof import('./Button.vue')['default']>['$props']");
    expect(generated).not.toContain("./src/Button.vue");
    const entry = readFileSync(join(folder, "index.ts"), "utf8");
    expect(entry.match(/export type \* from ['"]\.\/src\/api-types['"]/g)).toHaveLength(1);
    generate();
    expect(readFileSync(join(folder, "src/api-types.ts"), "utf8")).toBe(generated);
    expect(readFileSync(join(folder, "index.ts"), "utf8")).toBe(entry);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
