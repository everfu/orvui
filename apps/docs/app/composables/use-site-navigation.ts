import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from "vue";
import { LayoutGrid, Bot, Shapes, Blocks } from "lucide-vue-next";
import catalog from "../../../../tools/catalog/components.json";
import type {
  CatalogCategory,
  CatalogEntry,
} from "../../../../tools/registry/types";
import { useReducedMotion } from "../../../../packages/vue/src/lib/composables";
import { categoryNames } from "../utils/docs/i18n";
import { useNewBadgeClock } from "./new-badge";
interface Props {
  category?: string;
  pathname: string;
  en: boolean;
}
const guideDefinitions = [
  ["/guide", "介绍", "Introduction"],
  ["/docs/installation", "安装指南", "Installation"],
  ["/docs/theme", "主题配置", "Theme Setup"],
  ["/docs/motion-patterns", "动效指南", "Motion Guides"],
  ["/docs/ai-agents", "代理指南", "Agent Guide"],
  ["/docs/openui", "OpenUI", "OpenUI"],
] as const;
export function useSiteNavigation(props: Props) {
  const filter = ref("all"),
    tooltip = ref<string | null>(null),
    nav = ref<HTMLElement>(),
    id = useId(),
    reduce = useReducedMotion();
  const prefix = computed(() => (props.en ? "/en" : "")),
    charts = computed(() => props.category === "charts");
  const guides = computed(() =>
    guideDefinitions.map(([path, zh, en]) => ({
      path,
      label: props.en ? en : zh,
    })),
  );
  const filters = computed(() => [
    { value: "all", label: props.en ? "All" : "全部", icon: LayoutGrid },
    { value: "agents", label: props.en ? "Agents" : "AI 代理", icon: Bot },
    { value: "motion", label: props.en ? "Components" : "组件", icon: Shapes },
    { value: "blocks", label: props.en ? "Blocks" : "组合模块", icon: Blocks },
  ]);
  const categories = computed(() => {
    const lookup = new Map(
      (catalog.categories as CatalogCategory[]).map((category) => [
        category.slug,
        category,
      ]),
    );
    const order = charts.value ? ["charts"] : ["agents", "motion", "blocks"];
    return order.flatMap((slug) => {
      const category = lookup.get(slug);
      return category ? [category] : [];
    });
  });
  const clock = useNewBadgeClock(() =>
    categories.value.flatMap((category) => category.components),
  );
  function sorted(entries: CatalogEntry[]) {
    const recent: CatalogEntry[] = [],
      remaining: CatalogEntry[] = [];
    for (const entry of entries)
      (clock.isNew(entry) ? recent : remaining).push(entry);
    return recent.concat(remaining);
  }
  const routeTo = (category: string, slug?: string) =>
    `${prefix.value}/${category === "charts" ? "charts" : "components/" + category}${slug ? "/" + slug : ""}`;
  const label = (category: string) =>
    categoryNames[category]?.[props.en ? 1 : 0] || category;
  function select(value: string) {
    tooltip.value = null;
    filter.value = value;
  }
  function key(event: KeyboardEvent) {
    if (
      !(event.target instanceof HTMLButtonElement) ||
      event.target.getAttribute("role") !== "tab"
    )
      return;
    const rail = event.currentTarget as HTMLElement,
      buttons = Array.from(
        rail.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
      );
    const index = buttons.indexOf(event.target);
    let destination: number;
    if (event.key === "Home") destination = 0;
    else if (event.key === "End") destination = buttons.length - 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const forward = event.key === "ArrowRight" ? 1 : -1,
        direction = getComputedStyle(rail).direction === "rtl" ? -1 : 1;
      destination = index + forward * direction;
    } else return;
    event.preventDefault();
    const button = buttons[(destination + buttons.length) % buttons.length];
    button?.focus();
    button?.click();
  }
  let disposed = false,
    generation = 0,
    frame = 0,
    observer: ResizeObserver | undefined;
  function centerCurrent() {
    const root = nav.value;
    if (!root || disposed) return;
    const current = Array.from(
      root.querySelectorAll<HTMLAnchorElement>("a"),
    ).find((link) => link.getAttribute("href") === props.pathname);
    if (!current?.getClientRects().length) return;
    let scroller = root.parentElement;
    while (
      scroller &&
      !/auto|scroll/.test(getComputedStyle(scroller).overflowY)
    )
      scroller = scroller.parentElement;
    if (!scroller) return;
    const viewport = scroller.getBoundingClientRect(),
      row = current.getBoundingClientRect();
    if (row.top >= viewport.top + 64 && row.bottom <= viewport.bottom) return;
    scroller.scrollTop +=
      row.top - viewport.top - (viewport.height - row.height) / 2;
  }
  function reveal() {
    const revision = ++generation;
    void nextTick(() => {
      if (disposed || revision !== generation) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(centerCurrent);
    });
  }
  watch(
    () => props.category,
    (next, previous) => {
      if (next !== previous && filter.value !== "all")
        filter.value = next && next !== "charts" ? next : "all";
    },
  );
  watch([() => props.pathname, filter, () => props.en], reveal);
  onMounted(() => {
    reveal();
    if (nav.value && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(reveal);
      observer.observe(nav.value);
    }
    if (document.fonts)
      void document.fonts.ready.then(() => {
        if (!disposed) reveal();
      });
  });
  onBeforeUnmount(() => {
    disposed = true;
    generation++;
    cancelAnimationFrame(frame);
    observer?.disconnect();
  });
  return {
    guides,
    filter,
    tooltip,
    nav,
    id,
    reduce,
    prefix,
    charts,
    filters,
    categories,
    routeTo,
    label,
    sorted,
    select,
    key,
  };
}
