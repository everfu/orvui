import library from "../../packages/vue/package.json";
import type { PublicUsageSnippet } from "./public-usage-types";
/** Direct demo imports must also resolve with pnpm's isolated dependencies. */
export function demoDependencies(snippet: PublicUsageSnippet | undefined) {
  return (snippet?.dependencies ?? [])
    .filter((name) => name !== "vue")
    .map((name) => {
      const version = (library.dependencies as Record<string, string>)[name];
      if (!version)
        throw new Error(`No declared version for demo dependency ${name}`);
      return `${name}@${version}`;
    });
}
