// @vitest-environment node
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { sourceClosure } from "../tools/registry/source-closure";

it("follows a stable component barrel into relocated implementation and styles without shipping its tests", () => {
  const root = mkdtempSync(join(tmpdir(), "orvui-component-layout-"));
  try {
    for (const folder of ["button/src", "button/styles", "button/tests"])
      mkdirSync(join(root, folder), { recursive: true });
    writeFileSync(join(root, "button/index.ts"), 'export { default as Button } from "./src/Button.vue";');
    writeFileSync(join(root, "button/src/Button.vue"), '<script setup lang="ts">import "../styles/button.css";</script><template><button><slot /></button></template>');
    writeFileSync(join(root, "button/styles/button.css"), 'button { border-radius: var(--radius); }');
    writeFileSync(join(root, "button/tests/button.test.ts"), 'import "unlisted-test-only-package";');
    writeFileSync(join(root, "button/LICENSE.vendor"), 'Retained vendor license\n');
    const bundle = sourceClosure([join(root, "button/index.ts")], { root, dependencies: {} });
    expect(bundle.files.map(file => file.target)).toEqual([
      "~/src/components/orvui/button/index.ts",
      "~/src/components/orvui/button/src/Button.vue",
      "~/src/components/orvui/button/styles/button.css",
      "~/src/components/orvui/button/LICENSE.vendor.txt",
    ]);
    expect(bundle.dependencies).toEqual([]);
    expect(bundle.files.find(file => file.target.endsWith("LICENSE.vendor.txt"))!.content).toBe('Retained vendor license\n');
    writeFileSync(join(root, "button/src/Button.vue"), '<script setup lang="ts">import "../tests/button.test";</script>');
    expect(() => sourceClosure([join(root, "button/index.ts")], { root, dependencies: {} }))
      .toThrow("Registry runtime import reaches a test");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

it("keeps nested CSS imports beside their source for manual copy and CLI consumers", () => {
  const root = mkdtempSync(join(tmpdir(), "orvui-css-closure-"));
  try {
    mkdirSync(join(root, "theme"));
    writeFileSync(join(root, "index.ts"), 'export const control = "orvui";');
    writeFileSync(
      join(root, "styles.css"),
      '@import "tailwindcss";\n@import "./theme/tokens.css";',
    );
    writeFileSync(
      join(root, "theme/tokens.css"),
      '@import url("./palette.css");\n:root { --orvui-radius-control: 8px; }',
    );
    writeFileSync(
      join(root, "theme/palette.css"),
      ":root { --primary: #0285f7; }",
    );
    const bundle = sourceClosure(
      [join(root, "index.ts"), join(root, "styles.css")],
      {
        root,
        dependencies: { tailwindcss: "^4.0.0" },
      },
    );
    expect(bundle.dependencies).toEqual(["tailwindcss@^4.0.0"]);
    expect(bundle.files.map((file) => file.target)).toEqual([
      "~/src/components/orvui/index.ts",
      "~/src/components/orvui/styles.css",
      "~/src/components/orvui/theme/palette.css",
      "~/src/components/orvui/theme/tokens.css",
    ]);
    expect(
      bundle.files.find((file) => file.target.endsWith("tokens.css"))!.content,
    ).toBe(readFileSync(join(root, "theme/tokens.css"), "utf8"));
    expect(
      bundle.files
        .filter((file) => file.target.endsWith(".css"))
        .every(
          (file) =>
            file.path.endsWith(".css.txt") && file.type === "registry:file",
        ),
    ).toBe(true);
    writeFileSync(join(root, "styles.css"), '@import "./absent.css";');
    expect(() =>
      sourceClosure([join(root, "styles.css")], { root, dependencies: {} }),
    ).toThrow("Unresolved ./absent.css");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it("ships source-identical CSS closure and both legal notices with the standalone theme", () => {
  const theme = JSON.parse(
    readFileSync("apps/docs/public/r/orvui-theme.json", "utf8"),
  ) as {
    files: { path: string; target: string; type: string; content: string }[];
  };
  for (const source of ["styles.css", "tokens.css"]) {
    const installed = theme.files.find(
      (file) => file.target === `~/src/components/orvui/${source}`,
    );
    expect(installed, source).toBeDefined();
    expect(installed!.path).toBe(`registry/orvui/${source}.txt`);
    expect(installed!.content).toBe(
      readFileSync(`packages/vue/src/${source}`, "utf8"),
    );
  }
  for (const notice of ["LICENSE", "NOTICE"]) {
    const installed = theme.files.find(
      (file) => file.target === `~/src/components/orvui/${notice}.txt`,
    );
    expect(installed, notice).toBeDefined();
    expect(installed!.type).toBe("registry:file");
    expect(installed!.content).toBe(
      readFileSync(notice, "utf8"),
    );
  }
});

it("carries a vendor license beside every copied dependency without adding unrelated notices", () => {
  const root = mkdtempSync(join(tmpdir(), "orvui-vendor-closure-"));
  try {
    mkdirSync(join(root, "effect")); mkdirSync(join(root, "unused"));
    writeFileSync(join(root, "index.ts"), 'export { effect } from "./effect/renderer";');
    writeFileSync(join(root, "effect/renderer.ts"), 'export const effect = () => 1;');
    const vendorText = "Vendor license text\r\nCopyright © Example\nLiteral */ markers remain intact.";
    writeFileSync(join(root, "effect/LICENSE.vendor"), vendorText);
    writeFileSync(join(root, "unused/LICENSE.other"), "Unrelated license");
    const copied = sourceClosure([join(root, "index.ts")], { root, dependencies: {} });
    const license = copied.files.find(file => file.target.endsWith("effect/LICENSE.vendor.txt"));
    expect(license).toBeDefined();
    expect(license!.type).toBe("registry:file");
    expect(license!.path).toBe("registry/orvui/effect/LICENSE.vendor.txt");
    expect(Buffer.from(license!.content)).toEqual(readFileSync(join(root, "effect/LICENSE.vendor")));
    const copiedTarget = join(root, "copied-LICENSE.vendor.txt");
    writeFileSync(copiedTarget, license!.content);
    expect(readFileSync(copiedTarget)).toEqual(readFileSync(join(root, "effect/LICENSE.vendor")));
    expect(copied.files.some(file => file.target.includes("unused/"))).toBe(false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

it("rejects undeclared direct, re-exported and type dependencies while allowing the declared Vue peer", () => {
  const root = mkdtempSync(join(tmpdir(), "orvui-dependency-closure-"));
  try {
    const entry = join(root, "index.ts");
    for (const content of [
      'import missing from "missing-library";',
      'export { missing } from "@vendor/missing/subpath";',
      'export type Missing = import("missing-types").Missing;',
    ]) {
      writeFileSync(entry, content);
      expect(() => sourceClosure([entry], { root, dependencies: {} }))
        .toThrow("Undeclared registry dependency");
    }
    writeFileSync(entry, 'export { computed } from "vue";');
    expect(() => sourceClosure([entry], { root, dependencies: {} }))
      .toThrow("Undeclared registry dependency vue");
    expect(sourceClosure([entry], {
      root, dependencies: {}, peerDependencies: { vue: "^3.5.0" },
    }).dependencies).toEqual([]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
