import library from "../packages/vue/package.json";

export const stableRelease = {
  id: "stable",
  version: library.version,
  vue: "3.5",
  prefix: "",
} as const;
export const betaRelease = {
  id: "beta",
  version: "0.2.0-beta.1",
  vue: "3.6.0-rc.14",
  prefix: "/beta",
} as const;
export type ReleaseChannel = "stable" | "beta";
export const releaseChannels = [stableRelease, betaRelease];
export const betaArchiveName = `orvui-vue-${betaRelease.version}.tgz`;
export const betaArchivePath = `artifacts/packages/${betaRelease.version}/${betaArchiveName}`;
export function channelFromPath(path: string): ReleaseChannel {
  return /^\/beta(?:\/|$)/.test(path) ? "beta" : "stable";
}
export function unversionedPath(path: string): string {
  return path.replace(/^\/beta(?=\/|$)/, "") || "/";
}
/** Preserve the locale, query and anchor; resource and external URLs stay untouched. */
export function versionHref(href: string, channel: ReleaseChannel): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const path = unversionedPath(href);
  if (
    /^\/(?:en\/)?(?:$|\?|#|guide(?:[/?#]|$)|components(?:[/?#]|$)|charts(?:[/?#]|$)|templates(?:[/?#]|$)|docs\/|changelog(?:[/?#]|$))/.test(
      path,
    )
  )
    return (channel === "beta" ? "/beta" : "") + path;
  return href;
}

export const vueRuntimePackages = [
  "vue",
  "@vue/compiler-core",
  "@vue/compiler-dom",
  "@vue/compiler-sfc",
  "@vue/compiler-ssr",
  "@vue/reactivity",
  "@vue/runtime-core",
  "@vue/runtime-dom",
  "@vue/server-renderer",
  "@vue/shared",
];
export const betaVueOverrides = Object.fromEntries(
  vueRuntimePackages.map((name) => [name, betaRelease.vue]),
);
