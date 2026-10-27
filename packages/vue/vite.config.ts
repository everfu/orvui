import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { readdirSync, existsSync } from "node:fs";
const entry: Record<string, string> = { index: resolve("src/index.ts") };
for (const category of ["motion", "blocks", "agents", "charts"]) {
  if (existsSync(`src/${category}/index.ts`))
    entry[category] = resolve(`src/${category}/index.ts`);
  for (const slug of readdirSync(`src/${category}`, {
    withFileTypes: true,
  }).filter((d) => d.isDirectory())) {
    if (existsSync(`src/${category}/${slug.name}/index.ts`))
      entry[`${category}/${slug.name}`] = resolve(
        `src/${category}/${slug.name}/index.ts`,
      );
  }
}
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    lib: {
      entry,
      formats: ["es"],
      fileName: (_, name) => `${name}.js`,
      cssFileName: "style",
    },
    rollupOptions: {
      external: (id) => !id.startsWith(".") && !id.startsWith("/"),
    },
    sourcemap: true,
  },
});
