import catalog from "../../../../../tools/catalog/components.json";
import type { CatalogCategory } from "../../../../../tools/registry/types";
export const docsCatalog: CatalogCategory[] = catalog.categories;
export function docsPath(path: string, en = false) {
  const segments = path.split("/");
  if (segments[1] === "en") segments.splice(1, 1);
  const local = segments.join("/");
  return (en ? "/en" : "") + (local === "" || local === "/" ? "/guide" : local);
}
export function componentPath(category: string, slug?: string, en = false) {
  const segments = category === "charts" ? ["charts"] : ["components", category];
  if (slug) segments.push(slug);
  return docsPath("/" + segments.join("/"), en);
}
