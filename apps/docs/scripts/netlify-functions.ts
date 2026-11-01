import { existsSync } from "node:fs";
import { isBuiltin } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

/** Ship the Nuxt renderer and public MCP together, including manual monorepo deploys. */
export async function prepareNetlifyFunctions() {
  if (process.env.NITRO_PRESET !== "netlify") return;
  const root = fileURLToPath(new URL("../../../", import.meta.url));
  const directory = resolve(root, "apps/docs/.netlify/functions-internal");
  if (!existsSync(resolve(directory, "server/server.mjs")))
    throw new Error(
      "Build the Nuxt Netlify renderer before preparing MCP functions.",
    );
  // Netlify's traced bundles can retain pnpm symlinks relative to the wrong base
  // in a monorepo. Inline the SDK and data so the Lambda only needs Node builtins.
  const result = await build({
    absWorkingDir: root,
    entryPoints: [resolve(root, "apps/docs/netlify/functions/mcp.mjs")],
    outfile: resolve(directory, "mcp.mjs"),
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node24",
    sourcemap: false,
    legalComments: "eof",
    metafile: true,
    banner: {
      js: 'import { createRequire as __mcpCreateRequire } from "node:module"; const require = __mcpCreateRequire(import.meta.url);',
    },
  });
  for (const output of Object.values(result.metafile.outputs))
    for (const dependency of output.imports)
      if (dependency.external && !isBuiltin(dependency.path))
        throw new Error(
          `MCP function has an unbundled dependency: ${dependency.path}`,
        );
  console.log(
    "Netlify functions prepared: Nuxt renderer and public component MCP.",
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await prepareNetlifyFunctions();
