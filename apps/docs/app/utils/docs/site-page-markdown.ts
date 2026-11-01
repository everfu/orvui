import {
  betaRelease,
  versionHref,
  type ReleaseChannel,
} from "../../../../../tools/release-channels";
import {
  getSitePage,
  guideNextPages,
  SITE_VERSION,
  localize,
  resolveSiteCode,
  siteOrigin,
  type SitePageSlug,
  localSiteHtml,
} from "./site-page-data";
import { changelogAnchor, changelogEntries } from "./site-changelog-data";
import {
  motionDecisions,
  motionRecipes,
  motionTimings,
  reducedMotionCode,
} from "./site-motion-data";

function markdownHtml(text: string) {
  const output: string[] = [],
    links: string[] = [];
  for (const token of text.match(/<[^>]*>|[^<]+|</g) ?? []) {
    if (!token.startsWith("<") || token === "<") {
      output.push(token);
      continue;
    }
    const name = /^<\/?([a-z]+)/i.exec(token)?.[1]?.toLowerCase();
    const closing = token.startsWith("</");
    if (name === "a") {
      if (closing) output.push(`](${links.pop() ?? ""})`);
      else {
        links.push(/href="([^"]*)"/.exec(token)?.[1] ?? "");
        output.push("[");
      }
    } else if (name === "code") output.push("`");
    else if (name === "em") output.push("*");
  }
  return output.join("");
}
export function sitePageMarkdown(
  slug: SitePageSlug,
  en = false,
  origin?: string,
  channel: ReleaseChannel = "stable",
) {
  const page = getSitePage(slug, channel),
    tr = (zh: string, english: string) => (en ? english : zh);
  const out = [
    `# ${localize(page.title, en)}${page.status === "preview" ? " · Preview" : ""}`,
    "",
    markdownHtml(localSiteHtml(localize(page.description, en), en)),
    "",
    ...(["introduction", "installation"].includes(slug)
      ? []
      : [
          `> ${tr("产品版本", "Product version")}: ${channel === "beta" ? betaRelease.version : SITE_VERSION}`,
        ]),
    "",
  ];
  if (page.lead)
    out.push(markdownHtml(localSiteHtml(localize(page.lead, en), en)), "");
  for (const section of page.sections) {
    for (const id of section.legacyIds ?? [])
      out.push(`<a id="${id}"></a>`, "");
    out.push(
      `<a id="${section.id}"></a>`,
      "",
      `## ${localize(section.title, en)}`,
      "",
    );
    for (const block of section.blocks) {
      if (block.kind === "features")
        for (const item of block.items)
          out.push(
            `- **${localize(item.title, en)}** — ${markdownHtml(localSiteHtml(localize(item.text, en), en))}`,
            "",
          );
      if (block.kind === "faq")
        for (const item of block.items)
          out.push(
            `### ${localize(item.question, en)}`,
            "",
            markdownHtml(localSiteHtml(localize(item.answer, en), en)),
            "",
          );
      if (block.kind === "paragraph")
        out.push(markdownHtml(localSiteHtml(localize(block.text, en), en)), "");
      if (block.kind === "code")
        out.push(
          `\`\`\`${block.lang}`,
          resolveSiteCode(
            en && block.codeEn ? block.codeEn : block.code,
            origin,
            channel,
          ),
          "```",
          "",
        );
      if (block.kind === "callout")
        out.push(
          `> **${tr(block.tone === "warning" ? "注意事项" : "提示", block.tone === "warning" ? "Note" : "Tip")}**: ${markdownHtml(localSiteHtml(localize(block.text, en), en))}`,
          "",
        );
      if (block.kind === "steps")
        block.items.forEach((step, index) =>
          out.push(
            `${index + 1}. **${localize(step.title, en)}** — ${markdownHtml(localSiteHtml(localize(step.text, en), en))}`,
            "",
          ),
        );
      if (block.kind === "links")
        for (const item of block.items)
          out.push(
            `- [${localize(item.label, en)}](${item.url.includes("{") ? item.url : item.url.startsWith("/") ? siteOrigin(origin) + (item.endpoint ? item.url : versionHref((en ? "/en" : "") + item.url, channel)) : item.url}): ${localize(item.description, en)}`,
          );
    }
  }
  if (slug === "motion-patterns") {
    out.push(
      `## ${tr("动起来之前的四个问题", "Four questions before motion")}`,
      "",
    );
    for (const decision of motionDecisions)
      out.push(
        `### ${decision.number}. ${localize(decision.title, en)}`,
        "",
        localize(decision.body, en),
        "",
        localize(decision.note, en),
        "",
      );
    out.push(
      `## ${tr("动效令牌", "Motion tokens")}`,
      "",
      "- EASE_OUT: [0.16, 1, 0.3, 1]",
      "- EASE_IN_OUT: [0.77, 0, 0.175, 1]",
      `- SPRING_PRESS: ${tr("可按压表面的快速、有分量反馈。", "Fast, weighted feedback for pressable surfaces.")}`,
      `- SPRING_LAYOUT: ${tr("共享表面与指示器的持续空间运动。", "Continuous spatial movement for shared surfaces and indicators.")}`,
      "",
      `## ${tr("时长", "Timing")}`,
      "",
      `| ${tr("交互", "Interaction")} | ${tr("范围", "Range")} | ${tr("期望感受", "Desired feel")} |`,
      "| --- | --- | --- |",
    );
    for (const timing of motionTimings)
      out.push(
        `| ${localize(timing.use, en)} | ${localize(timing.range, en)} | ${localize(timing.feel, en)} |`,
      );
    out.push(
      "",
      tr(
        "界面动效默认控制在 300ms 以内。更长的动效适合解释性演示、有意图的手势和大范围空间变化。",
        "Under 300ms is the default for interface motion. Longer motion belongs to explanatory demos, deliberate gestures, and large spatial changes.",
      ),
      "",
      `## ${tr("可以复制的模式", "Patterns you can copy")}`,
      "",
    );
    for (const recipe of motionRecipes)
      out.push(
        `### ${localize(recipe.title, en)}`,
        "",
        localize(recipe.description, en),
        "",
        `**${tr("目的", "Purpose")}:** ${localize(recipe.purpose, en)}`,
        "",
        `**${tr("避免", "Avoid")}:** ${localize(recipe.avoid, en)}`,
        "",
        "```vue",
        recipe.code,
        "```",
        "",
      );
    out.push(
      `## ${tr("减少动态效果是一种设计状态", "Reduced motion is a designed state")}`,
      "",
      tr(
        "不要移除全部过渡。保留有助理解的透明度、颜色和即时状态反馈，移除视差、大幅变换、反复缩放和弹簧过冲。",
        "Do not remove every transition. Preserve opacity, color and instant state feedback; remove parallax, large transforms, repeated scale and spring overshoot.",
      ),
      "",
      "```ts",
      reducedMotionCode,
      "```",
      "",
    );
  }
  if (slug === "changelog")
    for (const week of changelogEntries) {
      out.push(
        `## ${week.date} — ${localize(week.title, en)}`,
        "",
        `<a id="${changelogAnchor(week.date)}"></a>`,
      );
      if (week.summary) out.push(localize(week.summary, en), "");
      for (const item of week.items)
        out.push(
          `- **${item.type}** ${localize(item.text, en)}${item.href ? ` [${item.label ?? tr("了解更多", "Learn more")}](${item.href})` : ""}`,
        );
      out.push("");
    }
  if (guideNextPages(slug).length)
    out.push(
      `## ${tr("下一步", "Next steps")}`,
      "",
      ...guideNextPages(slug).map(
        (next) =>
          `- [${localize(next.title, en)}](${en ? "/en" : ""}${next.path})`,
      ),
      "",
    );
  out.push(
    "",
    tr(
      "© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。",
      "© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.",
    ),
    "",
  );
  return out
    .join("\n")
    .replace(
      /\]\((\/[^)]+)\)/g,
      (_, href: string) => `](${versionHref(href, channel)})`,
    );
}
