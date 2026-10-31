import { useHead } from "#imports";
import type { DocsPage } from "../../../../tools/docs/routes";
import { applySocialMetadata, documentTitle } from "../utils/docs/page-metadata";

/** Each request and each client navigation receives its own metadata object. */
export function useDocsHead(
  page: () => DocsPage | undefined,
  errorLocale?: () => boolean,
) {
  useHead(() => {
    const doc = page();
    const en = doc ? doc.path.startsWith("/en/") : (errorLocale?.() ?? false);
    if (!doc)
      return {
        title: `${en ? "Page not found" : "页面未找到"} | orvui`,
        htmlAttrs: { lang: en ? "en" : "zh-CN" },
        meta: [{ name: "robots", content: "noindex, nofollow" }],
      };
    const data = { ...doc, frontmatter: { ...doc.frontmatter } };
    applySocialMetadata(data);
    const head = data.frontmatter as {
      head?: [string, Record<string, string>, string?][];
    };
    return {
      title: documentTitle(doc),
      htmlAttrs: { lang: en ? "en" : "zh-CN" },
      meta: [
        { name: "description", content: data.description },
        ...(head.head ?? [])
          .filter(([tag]) => tag === "meta")
          .map(([, attrs]) =>
            attrs.name
              ? { name: attrs.name, content: attrs.content }
              : { property: attrs.property, content: attrs.content },
          ),
      ],
      link: (head.head ?? [])
        .filter(([tag]) => tag === "link")
        .map(([, attrs]) => ({ rel: "canonical", href: attrs.href })),
    };
  });
}
