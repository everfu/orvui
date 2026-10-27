import { createHighlighter } from "shiki";
import {
  transformerNotationHighlight,
  transformerNotationDiff,
  transformerNotationFocus,
  transformerStyleToClass,
} from "@shikijs/transformers";
type Highlighter = Awaited<ReturnType<typeof createHighlighter>>;
const themes = {
  light: "github-light-high-contrast",
  dark: "github-dark-high-contrast",
};
let loading: Promise<Highlighter> | undefined;
const rendered = new WeakMap<Highlighter, Map<string, string>>();
export function getHighlighter() {
  if (!loading) {
    const request = createHighlighter({
      themes: Object.values(themes),
      langs: [
        "vue",
        "tsx",
        "typescript",
        "javascript",
        "jsx",
        "css",
        "bash",
        "json",
      ],
    });
    loading = request;
    void request.catch(() => {
      if (loading === request) loading = undefined;
    });
  }
  return loading;
}
export function highlightCode(
  highlighter: Highlighter,
  code: string,
  lang: string,
) {
  let cache = rendered.get(highlighter);
  if (!cache) {
    cache = new Map();
    rendered.set(highlighter, cache);
  }
  const key = lang + "\u0000" + code;
  const hit = cache.get(key);
  if (hit !== undefined) {
    cache.delete(key);
    cache.set(key, hit);
    return hit;
  }
  const classes = transformerStyleToClass({ classPrefix: "k" });
  const markup = highlighter.codeToHtml(code, {
    lang,
    themes,
    defaultColor: false,
    transformers: [
      transformerNotationHighlight(),
      transformerNotationDiff(),
      transformerNotationFocus(),
      classes,
    ],
  });
  const result = `<style>${classes.getCSS()}</style>${markup}`;
  cache.set(key, result);
  if (cache.size > 32) cache.delete(cache.keys().next().value!);
  return result;
}
