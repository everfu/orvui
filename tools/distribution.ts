import library from "../packages/vue/package.json";

/** Shared by generated documentation, registry output and package instructions. */
export const packageName = library.name;
export const packageVersion = library.version;
export const packageArchiveName = `${packageName.replace(/^@/, "").replaceAll("/", "-")}-${packageVersion}.tgz`;
export const shadcnVersion = "2.8.2";
export const documentationOrigin = "https://orvui.efu.me";
export const mcpEndpointUrl = `${documentationOrigin}/mcp`;
export const registryBaseUrl = `${documentationOrigin}/r`;

export function registryBaseForSite(siteUrl?: string): string {
  if (siteUrl) {
    const url = new URL(siteUrl);
    if (["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
      return `${url.origin}/r`;
  }
  return registryBaseUrl;
}

export function registryItemUrl(slug: string, base = registryBaseUrl): string {
  const encoded = encodeURIComponent(slug).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `${base.replace(/\/$/, "")}/${encoded}.json`;
}
