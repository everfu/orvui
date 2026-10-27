import { computed, onBeforeUnmount, ref, watch } from "vue";
type PageOptions = { pageUrl: string; markdownPath: string; markdown?: string; en?: boolean };
export function usePageActions(options: PageOptions) {
  const open = ref(false), copyState = ref<"idle" | "copying" | "copied" | "error">("idle");
  const trigger = ref<HTMLButtonElement | null>(null), menu = ref<HTMLDivElement | null>(null);
  const t = (english: string, chinese: string) => options.en ? english : chinese;
  const copyLabel = computed(() => copyState.value === "error" ? t("Try again", "重试") : t("Copy Page", "复制页面"));
  const names = { idle: ["Copy page as Markdown", "复制页面 Markdown"], copying: ["Copy page as Markdown", "复制页面 Markdown"], copied: ["Page copied", "页面已复制"], error: ["Copy failed. Try again", "复制失败，请重试"] };
  const copyAriaLabel = computed(() => { const pair = names[copyState.value]; return t(pair[0]!, pair[1]!); });
  let disposed = false;
  let active: AbortController | undefined;
  let reset: ReturnType<typeof setTimeout> | undefined, focus: ReturnType<typeof setTimeout> | undefined;
  const anchors = () => Array.from(menu.value?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
  function focusMenuItem(edge: "first" | "last") {
    open.value = true; clearTimeout(focus);
    focus = setTimeout(() => { if (!disposed && open.value) { const list = anchors(); (edge === "first" ? list[0] : list.at(-1))?.focus(); } });
  }
  function triggerKeyDown(event: KeyboardEvent) {
    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault(); focusMenuItem(event.key === "ArrowUp" ? "last" : "first");
  }
  function menuKeyDown(event: KeyboardEvent) {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const list = anchors(); if (!list.length) return;
    event.preventDefault();
    const index = list.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? list.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + list.length) % list.length;
    list[next]?.focus();
  }
  async function copyMarkdown() {
    active?.abort(); clearTimeout(reset);
    const task = active = new AbortController();
    const current = () => !disposed && active === task && !task.signal.aborted;
    copyState.value = "copying";
    try {
      let content = options.markdown;
      if (content === undefined) {
        const response = await fetch(options.markdownPath, { signal: task.signal });
        if (!response.ok) throw new Error("Markdown unavailable");
        content = await response.text();
      }
      if (!current()) return;
      await navigator.clipboard.writeText(content);
      if (!current()) return;
      copyState.value = "copied";
    } catch { if (!current()) return; copyState.value = "error"; }
    reset = setTimeout(() => { if (current()) copyState.value = "idle"; }, 1800);
  }
  watch(open, (value, previous) => { if (previous && !value && menu.value?.contains(document.activeElement)) trigger.value?.focus(); }, { flush: "sync" });
  onBeforeUnmount(() => { disposed = true; active?.abort(); clearTimeout(reset); clearTimeout(focus); });
  const actions = computed(() => {
    const prompt = `Read the orvui component documentation: ${options.pageUrl}.\nExplain the public Vue API, show a small integration, and help resolve issues using this page.`;
    return [
      { label: t("View as Markdown", "查看 Markdown"), href: options.markdownPath, icon: "file" },
      ...[["v0", "https://v0.dev", "V0Icon"], ["ChatGPT", "https://chatgpt.com", "ChatGPTIcon"], ["Claude", "https://claude.ai/new", "ClaudeIcon"]].map(([name, url, icon]) => ({ label: t(`Open in ${name}`, `在 ${name} 中打开`), href: `${url}?q=${encodeURIComponent(prompt)}`, icon: icon! })),
    ];
  });
  return { open, copyState, trigger, menu, t, copyLabel, copyAriaLabel, actions, copyMarkdown, focusMenuItem, triggerKeyDown, menuKeyDown };
}
