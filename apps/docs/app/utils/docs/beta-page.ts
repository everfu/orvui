import {
  betaRelease,
  betaVueOverrides,
  betaArchivePath,
  betaArchiveName,
  stableRelease,
} from "../../../../../tools/release-channels";
import type { SitePageDefinition, SiteBlock } from "./site-page-data";
const bi = (zh: string, en: string) => ({ zh, en });
const paragraph = (zh: string, en: string): SiteBlock => ({
  kind: "paragraph",
  text: bi(zh, en),
});
const code = (value: string): SiteBlock => ({
  kind: "code",
  code: value,
  lang: "bash",
  filename: "Terminal",
});
export function betaPage(original: SitePageDefinition): SitePageDefinition {
  // Shared APIs and anchors stay identical across the two compatible release channels.
  const page = JSON.parse(
    JSON.stringify(original)
      .replaceAll("Vue 3.5", "Vue 3.6")
      .replaceAll(stableRelease.version, betaRelease.version)
      .replaceAll("npm 组件包", "本地 Beta 组件包")
      .replaceAll("npm package", "local Beta package")
      .replaceAll(
        "组件包已发布到 npm；希望使用预构建组件时，可按安装指南直接安装 @orvui/vue。",
        "Beta 尚未发布到 npm；希望使用预构建组件时，请按安装指南制作并安装本地归档。",
      )
      .replaceAll(
        "The package is available on npm. Follow the installation guide to install @orvui/vue for prebuilt components.",
        "Beta is not published to npm. Follow the installation guide to build and install the local archive for prebuilt components.",
      )
      .replaceAll("pnpm add @orvui/vue", `pnpm add ./${betaArchiveName}`)
      .replaceAll("/r/", "/beta/r/"),
  ) as SitePageDefinition;
  if (page.slug !== "installation") return page;
  page.description = bi(
    `试用 orvui ${betaRelease.version} 与 Vue ${betaRelease.vue}。开发包尚未发布到 npm，使用本地归档安装。`,
    `Try orvui ${betaRelease.version} with Vue ${betaRelease.vue}. This development package is not on npm; install the local archive.`,
  );
  for (const section of page.sections) {
    if (section.id === "requirements")
      section.blocks.unshift(
        code(`pnpm add vue@${betaRelease.vue}`),
        paragraph(
          "本轮支持 Vue 3.6 常规虚拟 DOM 渲染与 SSR / 水合；未启用 Vapor 编译。Vue 与 Nuxt 应用均需合并下面的 package.json 配置，将 Vue 与 @vue/* 运行时、编译器锁定为同一个 RC 版本，再运行 pnpm install。",
          "This release supports Vue 3.6 virtual DOM rendering and SSR / hydration. Vapor compilation is not enabled. In both Vue and Nuxt applications, merge the package.json configuration below to pin Vue and the @vue/* runtimes and compilers to the same RC version, then run pnpm install.",
        ),
        {
          kind: "code",
          code: JSON.stringify(
            { pnpm: { overrides: betaVueOverrides } },
            null,
            2,
          ),
          lang: "json",
          filename: "package.json",
        },
        code("pnpm install"),
      );
    if (section.id === "package") {
      section.blocks = [
        paragraph(
          "先在 orvui 仓库制作本地包，再将归档复制到你的应用目录。归档包含编译产物、类型声明、源码注册表与许可证。",
          "Build the local package in the orvui checkout, then copy the archive into your application directory. It includes compiled components, declarations, source registry and licenses.",
        ),
        code(`pnpm beta:pack\n# ${betaArchivePath}`),
        code(`pnpm add ./${betaArchivePath.split("/").at(-1)}`),
        ...section.blocks.filter(
          (block) =>
            (block.kind === "code" && block.lang !== "bash") ||
            (block.kind === "paragraph" &&
              block.text.en.startsWith("Import <code>")),
        ),
      ];
    }
    for (const block of section.blocks) {
      if (block.kind === "paragraph") {
        block.text.zh = block.text.zh.replaceAll(" /r/", " /beta/r/");
        block.text.en = block.text.en.replaceAll(" /r/", " /beta/r/");
      }
    }
  }
  return page;
}
