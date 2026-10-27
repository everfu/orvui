import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
  type InjectionKey,
  type Ref,
} from "vue";
import catalogData from "../../../../tools/catalog/components.json";
import type { ProductCatalog } from "../../../../tools/registry/types";
import { documentationOrigin } from "../../../../tools/distribution";
import { categoryNames, descriptions } from "./i18n";
import { componentPath } from "./docs-routes";
import { useThemeToggle } from "../../../../packages/vue/src/motion/theme-toggle";
import type { SitePageSlug } from "./site-page-data";
import { appearance, readStoredAppearance, type Appearance } from "./appearance";

type Frontmatter = Record<string, unknown>;
const catalog = catalogData as ProductCatalog;

/** One lifetime owns the browser subscriptions for the whole documentation shell. */
export function createSiteShell(
  frontmatter: Ref<Frontmatter>,
  route: { path: string },
  router: { go: (href: string) => unknown },
) {
  const en = computed(() => route.path.startsWith("/en/"));
  const locale = computed(() => (en.value ? "/en" : ""));
  const home = computed(() => frontmatter.value.layout === "home");
  const category = computed(() =>
    catalog.categories.find((item) => item.slug === frontmatter.value.category),
  );
  const entry = computed(() =>
    category.value?.components.find(
      (item) => item.slug === frontmatter.value.slug,
    ),
  );
  const sitePage = computed(() => frontmatter.value.sitePage as SitePageSlug);
  const isSitePage = computed(() => frontmatter.value.layout === "site-page");
  const isGuide = computed(() => frontmatter.value.layout === "guide");
  const translate = (zh: string, english: string) => (en.value ? english : zh);
  const categoryLabel = (slug: string) =>
    categoryNames[slug]?.[en.value ? 1 : 0] ?? slug;
  const description = (slug: string, fallback: string) =>
    en.value
      ? fallback.replace(/\bReact\b/g, "Vue")
      : (descriptions[slug] ?? fallback);
  const routeTo = (section: string, component?: string) =>
    componentPath(section, component, en.value);
  const pathname = computed(() => route.path);
  const suffix = ref("");
  const origin = ref(documentationOrigin);
  const alternate = computed(
    () =>
      (en.value ? route.path.slice(3) || "/" : "/en" + route.path) +
      suffix.value,
  );
  const mobileMenu = ref(false);
  const searchOpen = ref(false);
  const preferencesOpen = ref(false);
  const scrolled = ref(false);
  const theme = ref<Appearance>("dark");
  const { toggle } = useThemeToggle({ variant: "circle", start: "center" });
  let browser: Window | undefined;
  let media: MediaQueryList | undefined;
  let alive = true;
  const dispose: Array<() => void> = [];
  const syncAddress = () => {
    if (browser) suffix.value = browser.location.search + browser.location.hash;
  };
  const renderAppearance = () => {
    if (browser)
      browser.document.documentElement.classList.toggle(
        "dark",
        theme.value === "dark" ||
          (theme.value === "system" && !!media?.matches),
      );
  };
  const changeTheme = (value: string) => {
    const next = appearance(value);
    if (!next) return;
    theme.value = next;
    if (browser) {
      try {
        browser.localStorage.setItem("orvui-theme", next);
      } catch {
        /* The in-memory control still works when storage is unavailable. */
      }
      try {
        browser.localStorage.setItem("vitepress-theme-appearance", next);
      } catch {
        /* Keep VitePress in sync whenever its preference can be saved. */
      }
    }
    renderAppearance();
  };
  const closeChrome = () => {
    mobileMenu.value = false;
    searchOpen.value = false;
    preferencesOpen.value = false;
  };
  const navigate = async (href: string) => {
    await router.go(href);
    if (alive) syncAddress();
  };
  watch(pathname, () => {
    closeChrome();
    void nextTick(() => {
      if (alive) syncAddress();
    });
  });
  onMounted(() => {
    browser = window;
    origin.value = browser.location.origin;
    syncAddress();
    media = browser.matchMedia("(prefers-color-scheme: dark)");
    try {
      theme.value = readStoredAppearance(browser.localStorage);
    } catch {
      /* Keep deterministic default. */
    }
    renderAppearance();
    const listen = (
      target: EventTarget,
      type: string,
      handler: EventListener,
      options?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, handler, options);
      dispose.push(() => target.removeEventListener(type, handler, options));
    };
    const updateScroll = () => {
      scrolled.value = window.scrollY > 8;
    };
    const updateWidth = () => {
      if (window.innerWidth >= (home.value ? 1280 : 768))
        mobileMenu.value = false;
    };
    const shortcut: EventListener = (event) => {
      const key = event as KeyboardEvent;
      const element = key.target instanceof HTMLElement ? key.target : null;
      const editing =
        element?.isContentEditable ||
        element?.closest("input, textarea, select, [contenteditable='true']");
      if (
        !editing &&
        key.shiftKey &&
        key.key.toLowerCase() === "d" &&
        !key.metaKey &&
        !key.ctrlKey &&
        !key.altKey
      )
        toggle();
      if (key.key === "Escape")
        queueMicrotask(() => {
          if (alive && !key.defaultPrevented) closeChrome();
        });
    };
    listen(browser, "hashchange", syncAddress);
    listen(browser, "popstate", syncAddress);
    listen(browser, "scroll", updateScroll, { passive: true });
    listen(browser, "resize", updateWidth);
    listen(browser.document, "keydown", shortcut);
    const themeChanged: EventListener = (event) => {
      const next = appearance((event as CustomEvent).detail);
      if (next) {
        theme.value = next;
        renderAppearance();
      }
    };
    listen(browser, "orvui-theme-change", themeChanged);
    listen(browser, "iui-theme-change", (event) => {
      const next = appearance((event as CustomEvent).detail);
      if (next) changeTheme(next);
    });
    listen(media, "change", renderAppearance);
    updateScroll();
  });
  onBeforeUnmount(() => {
    alive = false;
    for (const cleanup of dispose.splice(0).reverse()) cleanup();
    browser = undefined;
  });
  return {
    catalog,
    en,
    locale,
    home,
    category,
    entry,
    sitePage,
    isSitePage,
    isGuide,
    t: translate,
    categoryLabel,
    description,
    routeTo,
    pathname,
    suffix,
    origin,
    alternate,
    mobileMenu,
    searchOpen,
    preferencesOpen,
    scrolled,
    theme,
    changeTheme,
    navigate,
  };
}
export type SiteShell = ReturnType<typeof createSiteShell>;
const shellKey: InjectionKey<SiteShell> = Symbol("orvui-docs-shell");
export function provideSiteShell(shell: SiteShell) {
  provide(shellKey, shell);
}
export function useSiteShell() {
  const shell = inject(shellKey);
  if (!shell) throw new Error("The documentation shell is required.");
  return shell;
}
