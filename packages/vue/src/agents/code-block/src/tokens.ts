import {
  computed,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from "vue";
import type { Highlighter } from "shiki";
import type { AgentCodeLanguage } from "./AgentCode.vue";
export interface AgentCodeToken {
  content: string;
  offset: number;
  light?: string;
  dark?: string;
}
export type AgentCodeTokenLines = AgentCodeToken[][];
const results = new Map<string, AgentCodeTokenLines>();
let engine: Promise<Highlighter> | undefined;
const obtainEngine = () =>
  (engine ??= import("shiki").then((module) =>
    module.createHighlighter({
      themes: ["github-light-high-contrast", "github-dark-high-contrast"],
      langs: [
        "bash",
        "diff",
        "json",
        "tsx",
        "typescript",
        "javascript",
        "vue",
        "css",
        "html",
      ],
    }),
  ));
export function useAgentCodeTokens(
  code: MaybeRefOrGetter<string>,
  language: MaybeRefOrGetter<AgentCodeLanguage>,
) {
  const snapshot = shallowRef<{
    code: string;
    language: AgentCodeLanguage;
    lines: AgentCodeTokenLines;
  }>();
  let active = false,
    request = 0;
  async function refresh() {
    const revision = ++request;
    if (!active) return;
    const text = toValue(code),
      grammar = toValue(language),
      key = JSON.stringify([grammar, text]);
    try {
      let lines = results.get(key);
      if (!lines) {
        const highlighter = await obtainEngine();
        if (!active || revision !== request) return;
        lines = highlighter
          .codeToTokensWithThemes(text, {
            lang: grammar,
            themes: {
              light: "github-light-high-contrast",
              dark: "github-dark-high-contrast",
            },
          })
          .map((line) =>
            line.map((token) => ({
              content: token.content,
              offset: token.offset,
              light: token.variants.light?.color,
              dark: token.variants.dark?.color,
            })),
          );
        // Bound the shared memo so long-running streaming sessions can release old text.
        if (results.size >= 48) results.delete(results.keys().next().value!);
        results.set(key, lines);
      }
      if (active && revision === request)
        snapshot.value = { code: text, language: grammar, lines };
    } catch {
      if (active && revision === request) snapshot.value = undefined;
    }
  }
  watch([() => toValue(code), () => toValue(language)], refresh);
  onMounted(() => {
    active = true;
    refresh();
  });
  onBeforeUnmount(() => {
    active = false;
    request++;
  });
  return computed(() => {
    const current = snapshot.value;
    return current?.language === toValue(language) &&
      toValue(code).startsWith(current.code)
      ? current.lines
      : null;
  });
}
