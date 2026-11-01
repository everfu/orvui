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
import { categoryNames, descriptions } from "../utils/docs/i18n";
import { componentPath } from "../utils/docs/docs-routes";
import { useThemeToggle } from "../../../../packages/vue/src/motion/theme-toggle";
import type { SitePageSlug } from "../utils/docs/site-page-data";
import {
  appearance,
  readStoredAppearance,
  type Appearance,
} from "../utils/docs/appearance";
import { provideSitePreferences } from "./preferences";
import { resolveDocsSection } from "../utils/docs/document-sections";
import { provideTemplateContext } from "../templates/context";

import {
  channelFromPath,
  unversionedPath,
  versionHref,
} from "../../../../tools/release-channels";
import { docsVersionKey } from "./docs-version";

type Frontmatter = Record<string, unknown>;
const catalog = catalogData as ProductCatalog;

/** One lifetime owns the browser subscriptions for the whole documentation shell. */
export function createSiteShell(
  frontmatter: Ref<Frontmatter>,
  route: { path: string },
  router: { go: (href: string) => unknown },
) {
  provideSitePreferences();
  const channel = computed(() => channelFromPath(route.path));
  provide(docsVersionKey, channel);
  const canonicalPath = computed(() => unversionedPath(route.path));
  const en = computed(() => canonicalPath.value.startsWith("/en/"));
  provideTemplateContext(en, "");
  const docsSection = computed(() => resolveDocsSection(frontmatter.value));
  const pageLayout = computed(() => String(frontmatter.value.layout ?? ""));
  const templateSlug = computed(() =>
    String(frontmatter.value.templateSlug ?? ""),
  );
  const locale = computed(
    () => (channel.value === "beta" ? "/beta" : "") + (en.value ? "/en" : ""),
  );
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
    versionHref(componentPath(section, component, en.value), channel.value);
  const pathname = canonicalPath;
  const suffix = ref("");
  const origin = ref(documentationOrigin);
  const alternate = computed(
    () =>
      versionHref(
        en.value
          ? canonicalPath.value.slice(3) || "/"
          : "/en" + canonicalPath.value,
        channel.value,
      ) + suffix.value,
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
    }
    renderAppearance();
  };
  const closeChrome = () => {
    mobileMenu.value = false;
    searchOpen.value = false;
    preferencesOpen.value = false;
  };
  const navigate = async (href: string) => {
    await router.go(versionHref(href, channel.value));
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
      if (window.innerWidth >= (home.value ? 1280 : 1024))
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
    channel,
    addressPath: computed(() => route.path),
    docsSection,
    pageLayout,
    templateSlug,
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
