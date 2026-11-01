import { betaRelease } from "../../../../tools/release-channels";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useOverlay } from "../../../../packages/vue/src/lib/composables";
import { demoDependencies } from "../utils/docs/usage-dependencies";
import { usageFor } from "../utils/docs/public-usage";
import { buildComponentMarkdown } from "../utils/docs/component-markdown";
import type {
  CatalogCategory,
  CatalogEntry,
} from "../../../../tools/registry/types";
import type { ComponentDocs } from "../utils/docs/component-docs-types";
import docsData from "../data/component-docs.json";
import { getLocalizedDetails } from "../utils/docs/details";
import type { SiteShell } from "./site-shell-state";
const docs = docsData as unknown as ComponentDocs;
// Source panels load after navigation in the browser. Keeping raw source out of
// SSR also prevents server bundlers from rewriting environment checks in copy.
const sourceLoaders = import.meta.env.SSR
  ? {}
  : (import.meta.glob(
      [
        "../../../../packages/vue/src/**/*.{ts,vue,css}",
        "!../../../../packages/vue/src/**/tests/**",
      ],
      { query: "?raw", import: "default" },
    ) as Record<string, () => Promise<string>>);
type InstallMode = "registry" | "package";
const sourceKey = (path: string) => `../../../../${path}`;
const unique = (items: string[]) => [...new Set(items)];

/** A document owns request epochs, selected files and the preview overlay. */
export function createComponentDocument(
  category: () => CatalogCategory,
  entry: () => CatalogEntry,
  shell: SiteShell,
) {
  const tabs = ref<Record<string, string>>({});
  const selected = ref<Record<string, string>>({});
  const installMode = ref<InstallMode>("registry");
  const expanded = ref<string | null>(null);
  const expandedPanel = ref<HTMLElement | null>(null);
  const sources = reactive(new Map<string, string>());
  const dependencies = reactive(new Map<string, string[]>());
  let revision = 0;
  let expansionTicket = 0;
  let disposed = false;
  let mounted = false;
  let request: AbortController | undefined;
  const closeExpanded = () => {
    ++expansionTicket;
    expanded.value = null;
  };
  useOverlay(
    computed(() => expanded.value !== null),
    expandedPanel,
    closeExpanded,
  );
  const expand = async (slug: string) => {
    closeExpanded();
    const ticket = expansionTicket;
    const route = shell.pathname.value;
    tabs.value[slug] = "preview";
    await nextTick();
    if (
      !disposed &&
      ticket === expansionTicket &&
      route === shell.pathname.value
    )
      expanded.value = slug;
  };
  const bindStage = (element: unknown, slug: string) => {
    if (slug === expanded.value)
      expandedPanel.value = element as HTMLElement | null;
  };
  const examples = computed(() =>
    entry().examples?.length
      ? entry().examples!
      : [
          {
            slug: "default",
            name: entry().name,
            description: "",
            installSlug: entry().slug,
            badge: undefined,
            launchedAt: undefined,
          },
        ],
  );
  const variants = computed(() =>
    unique(["default", ...(entry().examples ?? []).map((item) => item.slug)]),
  );
  const api = computed(
    () => docs.entries[`${category().slug}/${entry().slug}`],
  );
  const compositionFor = (variant: string) =>
    api.value?.variants[variant] ?? api.value?.default;
  const usageRecord = (variant: string, mode: InstallMode = "package") =>
    usageFor(category().slug, entry().slug, variant, mode);
  const usage = (variant: string, mode: InstallMode = "package") =>
    usageRecord(variant, mode)?.code ?? "";
  const installSlugs = (variant: string) =>
    usageRecord(variant)?.registryInstallSlugs;
  const extraDependencies = (variant: string) =>
    usageRecord(variant)?.registryExtraDependencies ?? [];
  const previewDependencies = (variant: string) =>
    demoDependencies(usageRecord(variant));
  const allInstallSlugs = computed(() =>
    unique(variants.value.flatMap((variant) => installSlugs(variant) ?? [])),
  );
  const allExtraDependencies = computed(() =>
    unique(variants.value.flatMap(extraDependencies)),
  );
  const allPreviewDependencies = computed(() =>
    unique(variants.value.flatMap(previewDependencies)),
  );
  const folder = computed(() => `/${category().slug}/${entry().slug}/`);
  const fileEntries = computed(() =>
    [...sources]
      .filter(
        ([path]) =>
          path.includes(folder.value) &&
          !path.endsWith("/demo.vue") &&
          !path.includes("/examples/"),
      )
      .sort(([a], [b]) => a.localeCompare(b)),
  );
  const sourcePath = (variant: string) =>
    selected.value[variant] ??
    (compositionFor(variant)?.primaryFile
      ? sourceKey(compositionFor(variant)!.primaryFile!)
      : (fileEntries.value[0]?.[0] ?? ""));
  const sourceFor = (variant: string) => sources.get(sourcePath(variant)) ?? "";
  const filesFor = (variant: string) => {
    const preferred = new Set(
      (compositionFor(variant)?.sourceFiles ?? []).map(sourceKey),
    );
    return [...fileEntries.value].sort(
      ([a], [b]) =>
        Number(preferred.has(b)) - Number(preferred.has(a)) ||
        a.localeCompare(b),
    );
  };
  const showApi = (variant: string) => {
    const entries = entry().examples;
    return (
      !entries?.length ||
      new Set(entries.map((item) => item.file)).size > 1 ||
      entries.at(-1)?.slug === variant
    );
  };
  const fetchSources = async (epoch: number) => {
    const paths = Object.keys(sourceLoaders).filter(
      (path) => path.includes(folder.value) && !sources.has(path),
    );
    await Promise.allSettled(
      paths.map(async (path) => {
        const content = await sourceLoaders[path]!();
        if (!disposed && revision === epoch) sources.set(path, content);
      }),
    );
  };
  const fetchDependencies = async () => {
    request?.abort();
    const controller = new AbortController();
    request = controller;
    const absent = allInstallSlugs.value.filter(
      (slug) => !dependencies.has(slug),
    );
    await Promise.allSettled(
      absent.map(async (slug) => {
        const response = await fetch(
          `${shell.channel.value === "beta" ? "/beta" : ""}/r/${encodeURIComponent(slug)}.json`,
          {
            signal: controller.signal,
          },
        );
        if (!response.ok) return;
        const data: unknown = await response.json();
        const list = (data as { dependencies?: unknown })?.dependencies;
        if (
          !disposed &&
          !controller.signal.aborted &&
          Array.isArray(list) &&
          list.every((item) => typeof item === "string")
        )
          dependencies.set(slug, list);
      }),
    );
  };
  watch(
    () => `${shell.channel.value}/${category().slug}/${entry().slug}`,
    () => {
      ++revision;
      dependencies.clear();
      tabs.value = {};
      selected.value = {};
      closeExpanded();
      void fetchSources(revision);
      if (mounted) void fetchDependencies();
    },
    { immediate: true },
  );
  watch(shell.pathname, closeExpanded);
  onMounted(() => {
    mounted = true;
    void fetchDependencies();
  });
  onBeforeUnmount(() => {
    disposed = true;
    ++revision;
    closeExpanded();
    request?.abort();
  });
  const pageUrl = computed(
    () => shell.origin.value + shell.addressPath.value.replace(/\/$/, ""),
  );
  const pageMarkdown = computed(() => {
    if (
      !api.value ||
      !allInstallSlugs.value.every((slug) => dependencies.has(slug))
    )
      return undefined;
    const packageExamples = Object.fromEntries(
      variants.value.map((variant) => [variant, usage(variant)]),
    );
    if (Object.values(packageExamples).some((code) => !code.trim()))
      return undefined;
    return buildComponentMarkdown({
      category: category(),
      component: entry(),
      api: api.value,
      usage: packageExamples,
      registryUsage: Object.fromEntries(
        variants.value.map((variant) => [
          variant,
          {
            code: usage(variant, "registry"),
            installSlugs: installSlugs(variant) ?? [],
            extraDependencies: extraDependencies(variant),
          },
        ]),
      ),
      details: getLocalizedDetails(
        category().slug,
        entry().slug,
        shell.en.value,
      ),
      pageUrl: pageUrl.value,
      registryBaseUrl:
        shell.origin.value +
        (shell.channel.value === "beta" ? "/beta/r" : "/r"),
      demoDependencies: allPreviewDependencies.value,
      dependencies: unique(
        allInstallSlugs.value.flatMap((slug) => dependencies.get(slug) ?? []),
      ),
      description: shell.description(entry().slug, entry().description),
      locale: shell.en.value ? "en" : "zh",
      productVersion:
        shell.channel.value === "beta"
          ? betaRelease.version
          : shell.catalog.product.version,
      channel: shell.channel.value,
    });
  });
  return {
    tabs,
    selected,
    installMode,
    expanded,
    expand,
    closeExpanded,
    bindStage,
    examples,
    compositionFor,
    usage,
    installSlugs,
    extraDependencies,
    previewDependencies,
    allInstallSlugs,
    allExtraDependencies,
    allPreviewDependencies,
    sourcePath,
    sourceFor,
    filesFor,
    showApi,
    pageUrl,
    pageMarkdown,
  };
}
