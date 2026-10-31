// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { expect, it } from "vitest";
import { createRegistry, validateRegistryItem, writeRegistryOutputs } from "../../tools/registry/build";
import type { ProductCatalog } from "../../tools/registry/types";

function fixture() {
  const directory = mkdtempSync(join(tmpdir(), "orvui-registry-distribution-"));
  const put = (path: string, text: string) => {
    mkdirSync(dirname(join(directory, path)), { recursive: true });
    writeFileSync(join(directory, path), text);
  };
  put("packages/vue/package.json", JSON.stringify({
    name: "@orvui/vue", version: "0.1.0", dependencies: { clsx: "^2.1.1" }, peerDependencies: { vue: "^3.5.0" },
  }));
  put("packages/vue/src/motion/button/index.ts", 'export { computed } from "vue";\nexport { clsx } from "clsx";');
  put("packages/vue/src/motion/button/demo.vue", "<template>Button</template>");
  put("packages/vue/src/motion/button/examples/secondary.vue", "<template>Secondary</template>");
  put("packages/vue/src/styles.css", '@import "./tokens.css";');
  put("packages/vue/src/tokens.css", ":root { --primary: #0285f7; }");
  put("LICENSE", "Copyright (c) 2026 iUI contributors\r\nMIT\n");
  put("NOTICE", "Original third-party notice\r\n");
  const catalog: ProductCatalog = { schemaVersion: 2, product: { name: "orvui", version: "0.1.0", description: "Components" }, categories: [{
    slug: "motion", name: "Motion", description: "Motion", components: [{ slug: "button", name: "Button", description: "Button", file: "", examples: [{
      slug: "secondary", name: "Secondary Button", file: "", previewFile: "", previewKey: "", installSlug: "button-secondary",
    }] }],
  }] };
  return { directory, put, catalog };
}

it("serializes one catalog to matching docs and packaged registries, including aliases and theme", () => {
  const { directory, catalog, put } = fixture();
  try {
    const outputPaths = [join(directory, "apps/docs/public/r"), join(directory, "packages/vue/registry")];
    put("apps/docs/public/r/iui-theme.json", "stale");
    put("packages/vue/registry/deleted-component.json", "stale");
    put("apps/docs/public/r/motion/button/raw.txt", "retained source");
    const { documents } = createRegistry({ directory, catalog, strict: true });
    writeRegistryOutputs(documents, outputPaths);
    for (const [name, content] of documents) for (const output of outputPaths)
      expect(readFileSync(join(output, name), "utf8")).toBe(content);
    for (const output of outputPaths)
      expect(readdirSync(output).filter((name) => name.endsWith(".json")).sort()).toEqual([...documents.keys()].sort());
    expect(readFileSync(join(directory, "apps/docs/public/r/motion/button/raw.txt"), "utf8")).toBe("retained source");
    const index = JSON.parse(documents.get("registry.json")!);
    expect(index.homepage).toBe("https://orvui.efu.me");
    expect(index.items.map((item: { name: string }) => item.name)).toEqual(["button", "button-secondary", "orvui-theme"]);
    const button = JSON.parse(documents.get("button.json")!);
    expect(button.meta.registry).toBe("https://orvui.efu.me/r/button.json");
    expect(button.dependencies).toEqual(["clsx@^2.1.1"]);
    expect(button.files.find((file: { target: string }) => file.target.endsWith("/LICENSE.txt")).content)
      .toBe(readFileSync(join(directory, "LICENSE"), "utf8"));
    expect(JSON.stringify(index)).not.toMatch(/localhost|127\.0\.0\.1/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

it("strict generation fails incomplete coverage, colliding aliases and undeclared imports", () => {
  const { directory, catalog, put } = fixture();
  try {
    rmSync(join(directory, "packages/vue/src/motion/button/demo.vue"));
    expect(() => createRegistry({ directory, catalog, strict: true })).toThrow("Strict registry coverage");
    put("packages/vue/src/motion/button/demo.vue", "<template>Button</template>");
    catalog.categories[0].components[0].examples![0].installSlug = "orvui-theme";
    expect(() => createRegistry({ directory, catalog, strict: true })).toThrow("Duplicate registry item");
    catalog.categories[0].components[0].examples![0].installSlug = "button-secondary";
    put("packages/vue/src/motion/button/index.ts", 'export { missing } from "unlisted-package";');
    expect(() => createRegistry({ directory, catalog, strict: true })).toThrow("Undeclared registry dependency unlisted-package");
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

it("rejects invalid schema fields, unsafe paths, duplicate targets and invalid dependency declarations", () => {
  const { directory, catalog } = fixture();
  try {
    const original = JSON.parse(createRegistry({ directory, catalog, strict: true }).documents.get("button.json")!);
    for (const mutate of [
      (item: typeof original) => { item.type = "component"; },
      (item: typeof original) => { item.files[0].target = "~/src/components/orvui/../outside.ts"; },
      (item: typeof original) => { item.files[0].path = "/absolute/source.ts"; },
      (item: typeof original) => { item.files.push(item.files[0]); },
      (item: typeof original) => { item.dependencies = ["clsx"]; },
      (item: typeof original) => { item.files[0].content = false; },
    ]) {
      const item = structuredClone(original);
      mutate(item);
      expect(() => validateRegistryItem(item)).toThrow();
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

it.each([
  { slug: "button", componentRoots: ["motion/button/"] },
  { slug: "morphing-modal", componentRoots: ["motion/morphing-modal/", "motion/_overlay/"] },
  { slug: "prompt-input", componentRoots: ["agents/prompt-input/", "motion/button/", "motion/popover/", "motion/select/"] },
  { slug: "donut-chart", componentRoots: ["charts/donut-chart/", "motion/number/"] },
])("keeps $slug source installation within its component and actual dependencies", ({ slug, componentRoots }) => {
  const item = JSON.parse(readFileSync(`apps/docs/public/r/${slug}.json`, "utf8"));
  const sharedFiles = new Set([
    "styles.css", "tokens.css", "LICENSE.txt", "NOTICE.txt",
    "agents/shared.ts", "blocks/shared.ts", "blocks/dismiss.ts", "charts/shared.ts",
  ]);
  for (const file of item.files) {
    const target = file.target.replace("~/src/components/orvui/", "");
    expect(target, `${slug}: avoid demos and tests`).not.toMatch(/(?:^|\/)(?:demo\.vue|examples\/|tests\/)/);
    expect(target, `${slug}: avoid package and category barrels`).not.toMatch(/^(?:(?:motion|blocks|agents|charts)\/)?index\.ts$/);
    expect(sharedFiles.has(target) || target.startsWith("lib/")
      || componentRoots.some((root) => target.startsWith(root)), `${slug}: unrelated source ${target}`).toBe(true);
  }
  expect(item.dependencies, `${slug}: avoid unrelated feature dependencies`).not.toEqual(
    expect.arrayContaining([expect.stringMatching(/^(?:shiki|lenis|@paper-design\/shaders|@tanstack\/vue-virtual)@/)]),
  );
});
