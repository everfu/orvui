import { defineConfig, type UserConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { appearanceBootstrap } from "./theme/appearance";
import {
  applySocialMetadata,
  notFoundRobots,
  siteDescriptions,
} from "./social";
export default defineConfig({
  title: "orvui",
  description: siteDescriptions.zh,
  lang: "zh-CN",
  cleanUrls: true,
  // The custom shell owns appearance, including first-paint storage migration.
  appearance: false,
  srcExclude: ["public/**"],
  lastUpdated: false,
  head: [
    ["link", { rel: "icon", href: "/favicon.svg?v=2" }],
    // Virtual 404s bypass transformPageData; real pages override this fallback.
    notFoundRobots,
    ["script", {}, appearanceBootstrap],
  ],
  locales: {
    root: { label: "简体中文", lang: "zh-CN" },
    en: { label: "English", lang: "en", description: siteDescriptions.en },
  },
  transformPageData: applySocialMetadata,
  // Render attributes through VitePress's escaping path, including quoted copy.
  transformHead: ({ description }) => [
    ["meta", { name: "description", content: description }],
  ],
  vite: {
    plugins: tailwindcss() as unknown as NonNullable<
      NonNullable<UserConfig["vite"]>["plugins"]
    >,
    resolve: {
      alias: {
        "@orvui/vue": fileURLToPath(
          new URL("../../../packages/vue/src/index.ts", import.meta.url),
        ),
      },
    },
    server: {
      hmr: process.env.ORVUI_DOCS_HMR === "off" ? false : undefined,
      fs: { allow: [fileURLToPath(new URL("../../..", import.meta.url))] },
    },
  },
  ignoreDeadLinks: false,
});
