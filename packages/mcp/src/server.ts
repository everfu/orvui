import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import type { AiData, ComponentRecord, Locale } from "./data.js";

const locale = z.enum(["zh", "en"]).default("zh");
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const componentInput = { slug, variant: slug.optional(), locale };
const own = <T>(values: Record<string, T>, key: string): T | undefined =>
  Object.hasOwn(values, key) ? values[key] : undefined;

/** Read-only handlers operate on the bundled snapshot, never on caller-supplied paths. */
export function createServer(
  data: AiData,
  options: { onToolCall?: (tool: string) => void } = {},
) {
  const server = new McpServer({
    name: "orvui",
    version: data.product.version,
  });
  function result(source: string, value: unknown) {
    const payload = {
      productVersion: data.product.version,
      source,
      data: value,
    };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  }
  function component(name: string, variant?: string) {
    const record = own(data.components, name);
    if (!record)
      throw new Error(`Unknown component: ${name}. Use list_components.`);
    if (variant && !record.variants.some((entry) => entry.slug === variant))
      throw new Error(
        `Unknown variant: ${name}/${variant}. Available: ${record.variants.map((entry) => entry.slug).join(", ") || "none"}`,
      );
    return record;
  }
  function register<T extends z.ZodRawShape>(
    name: string,
    description: string,
    inputSchema: T,
    handler: (input: z.output<z.ZodObject<T>>) => ReturnType<typeof result>,
  ) {
    server.registerTool(
      name,
      {
        description,
        inputSchema: z.object(inputSchema),
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async (input) => {
        try {
          options.onToolCall?.(name);
          return handler(input as z.output<z.ZodObject<T>>);
        } catch (error) {
          return {
            isError: true,
            ...result(data.source, {
              error: error instanceof Error ? error.message : String(error),
            }),
          };
        }
      },
    );
  }
  register(
    "list_components",
    "Discover orvui Vue components, canonical slugs and registered variants.",
    {
      category: slug.optional(),
      query: z.string().optional(),
      locale,
    },
    ({ category, query, locale }) => {
      if (
        category &&
        !Object.values(data.components).some(
          (entry) => entry.category === category,
        )
      )
        throw new Error(`Unknown category: ${category}`);
      const words =
        query?.toLowerCase().trim().split(/\s+/).filter(Boolean) ?? [];
      return result(
        data.source,
        Object.values(data.components)
          .filter((entry) => !category || entry.category === category)
          .filter((entry) =>
            words.every((word) =>
              [
                entry.slug,
                entry.name,
                ...Object.values(entry.description),
                ...entry.keywords,
              ]
                .join(" ")
                .toLowerCase()
                .includes(word),
            ),
          )
          .map((entry) => ({
            slug: entry.slug,
            name: entry.name,
            category: entry.category,
            description: entry.description[locale],
            variants: entry.variants,
            source: entry.source,
          })),
      );
    },
  );
  register(
    "get_component_docs",
    "Read actual Vue APIs, bindings, package and copy-source examples. Variant uses the example slug.",
    componentInput,
    ({ slug, variant, locale }) => {
      const entry = component(slug, variant);
      return result(entry.source, {
        markdown: entry.docs[locale],
        api: variant ? entry.api.variants[variant] : entry.api.default,
        publicComponents: entry.api.publicComponents,
        usage: entry.usage[variant ?? "default"],
        variants: entry.variants,
      });
    },
  );
  const files = (entry: ComponentRecord) =>
    entry.files.map((path) => data.files[path]);
  register(
    "get_component_source_code",
    "Read the complete registry source closure, dependencies and original license notices.",
    { slug },
    ({ slug }) => {
      const entry = component(slug);
      return result(entry.source, {
        files: files(entry),
        dependencies: entry.dependencies,
      });
    },
  );
  register(
    "get_component_source_styles",
    "Read standalone CSS and SFC style blocks with their original source paths and notices.",
    { slug },
    ({ slug }) => {
      const entry = component(slug);
      return result(entry.source, {
        files: files(entry).flatMap((file) => {
          if (/\.css(?:\.txt)?$/.test(file.path)) return [file];
          if (!file.path.endsWith(".vue")) return [];
          const blocks =
            file.content.match(/<style\b[^>]*>[\s\S]*?<\/style>/g) ?? [];
          return blocks.length
            ? [{ ...file, content: blocks.join("\n\n") }]
            : [];
        }),
        notices: files(entry).filter((file) =>
          /\/(?:LICENSE|NOTICE)(?:[.-]|$)/i.test(file.path),
        ),
      });
    },
  );
  register(
    "get_theme_variables",
    "Read canonical palette values and semantic CSS, preserving consumer overrides.",
    {
      palette: slug.default("default"),
      mode: z.enum(["light", "dark"]).default("light"),
    },
    ({ palette, mode }) => {
      const theme = own(data.themes, palette);
      if (!theme)
        throw new Error(
          `Unknown palette: ${palette}. Available: ${Object.keys(data.themes).join(", ")}`,
        );
      return result(`${data.source}/theme.css`, {
        palette,
        mode,
        variables: theme[mode],
        palettes: Object.keys(data.themes),
        css: data.themeCss,
      });
    },
  );
  register(
    "get_docs",
    "Read a public guide or component by its site path, such as /docs/installation. No arbitrary URLs or file paths.",
    {
      path: z.string(),
      locale,
    },
    ({ path, locale }) => {
      // Exact lookup only; no filesystem access or path normalization that can escape the allowlist.
      const key = `${locale === "en" ? "/en" : ""}${path.replace(/^\/en(?=\/)/, "").replace(/\.md$/, "")}`;
      const guide = own(data.guides, key);
      if (!guide)
        throw new Error(
          `Unknown documentation path: ${path}. Use a published guide or component route.`,
        );
      return result(guide.source, { markdown: guide.markdown });
    },
  );
  register(
    "get_component_skill",
    "Read component selection, composition, bindings and constraints without loading unrelated components.",
    { slug, locale },
    ({ slug, locale }) => {
      const entry = component(slug);
      return result(entry.source, { markdown: entry.skills[locale] });
    },
  );
  return server;
}
