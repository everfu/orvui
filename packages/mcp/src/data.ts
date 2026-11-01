import { readFileSync } from "node:fs";

export type Locale = "zh" | "en";
export interface SourceFile {
  path: string;
  target: string;
  type: string;
  content: string;
}
export interface Usage {
  code: string;
  registryCode: string;
  installSlugs: string[];
  dependencies: string[];
  extraDependencies: string[];
}
export interface ComponentRecord {
  slug: string;
  category: string;
  name: string;
  description: Record<Locale, string>;
  keywords: string[];
  variants: { slug: string; name: string; installSlug: string }[];
  source: string;
  files: string[];
  dependencies: string[];
  api: {
    default: unknown;
    variants: Record<string, unknown>;
    publicComponents: string[];
  };
  usage: Record<string, Usage>;
  docs: Record<Locale, string>;
  skills: Record<Locale, string>;
}
export interface AiData {
  schemaVersion: 1;
  product: { name: string; version: string };
  source: string;
  components: Record<string, ComponentRecord>;
  files: Record<string, SourceFile>;
  guides: Record<string, { source: string; markdown: string }>;
  themes: Record<
    string,
    {
      name: string;
      swatch: string;
      light: Record<string, string>;
      dark: Record<string, string>;
    }
  >;
  themeCss: string;
}

export function loadData(
  url = new URL("../data/manifest.json", import.meta.url),
): AiData {
  const data = JSON.parse(readFileSync(url, "utf8")) as AiData;
  if (
    data.schemaVersion !== 1 ||
    data.product?.name !== "orvui" ||
    !data.product.version ||
    !data.components ||
    !data.files ||
    !data.guides ||
    !data.themes
  )
    throw new Error("Invalid orvui AI data. Rebuild with pnpm mcp:build.");
  for (const component of Object.values(data.components)) {
    if (
      !component.docs.zh ||
      !component.docs.en ||
      !component.skills.zh ||
      !component.skills.en ||
      component.files.some((file) => !Object.hasOwn(data.files, file))
    )
      throw new Error(`Incomplete orvui AI data: ${component.slug}`);
  }
  return data;
}
