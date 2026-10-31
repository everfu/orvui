import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";
import type { NuxtConfig } from "nuxt/schema";
import tailwindcss from "@tailwindcss/vite";
import { createDocsPages } from "../../tools/docs/routes";
import { appearanceBootstrap } from "./app/utils/docs/appearance";

const path = (value: string) => fileURLToPath(new URL(value, import.meta.url));
const pages = createDocsPages();

export default defineNuxtConfig({
  compatibilityDate: "2026-10-27",
  ssr: true,
  telemetry: false,
  devtools: { enabled: false },
  components: false,
  imports: { autoImport: false },
  typescript: {
    tsConfig: {
      compilerOptions: { strict: true, noUncheckedIndexedAccess: false },
    },
  },
  alias: { "@orvui/vue": path("../../packages/vue/src/index.ts") },
  // A single entry lets Tailwind see the shell's @source directives as well as
  // the library, so responsive documentation utilities survive production builds.
  css: [path("./app/assets/docs.css")],
  app: {
    head: {
      htmlAttrs: { lang: "zh-CN" },
      link: [{ rel: "icon", href: "/favicon.svg?v=2" }],
      script: [{ innerHTML: appearanceBootstrap, tagPosition: "head" }],
    },
  },
  nitro: { preset: process.env.NITRO_PRESET ?? "node-server" },
  routeRules: {
    "/**": {
      headers: {
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Content-Type-Options": "nosniff",
      },
    },
    "/r/**": {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300, must-revalidate",
      },
    },
    "/_nuxt/**": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
  },
  vite: {
    build: { cssMinify: "esbuild" },
    plugins: tailwindcss() as unknown as NonNullable<
      NonNullable<NuxtConfig["vite"]>["plugins"]
    >,
    server: {
      fs: { allow: [path("../..")] },
    },
  },
  hooks: {
    "pages:extend"(routes) {
      for (const page of pages)
        routes.push({
          name: `docs:${page.path}`,
          path: page.path,
          file: path("./app/pages/[...slug].vue"),
          meta: { orvuiPage: page },
        });
    },
  },
});
