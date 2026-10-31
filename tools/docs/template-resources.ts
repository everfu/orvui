import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { templateDefinitions } from "../../apps/docs/app/utils/docs/template-definitions";
/** Only public gallery metadata is generated here. Complete sources live in private repositories. */
export function buildTemplateResources(root = process.cwd()) {
  const publicRoot = resolve(root, "apps/docs/public/templates");
  mkdirSync(publicRoot, { recursive: true });
  for (const template of templateDefinitions) {
    for (const filename of ["source.json", "source.zip"])
      rmSync(resolve(publicRoot, template.slug, filename), { force: true });
  }
  const manifest = templateDefinitions.map(
    ({ slug, name, description, previewUrl, screenshot, pages }) => ({
      slug,
      name,
      description,
      previewUrl,
      screenshot,
      pages,
    }),
  );
  writeFileSync(
    resolve(publicRoot, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  return manifest;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  console.log(
    JSON.stringify(
      buildTemplateResources().map(({ slug, previewUrl }) => ({
        slug,
        previewUrl,
      })),
      null,
      2,
    ),
  );
