export interface CatalogSource {
  file: string;
  extraFiles?: string[];
  usageFile?: string;
  previewFile?: string;
}
export interface CatalogExample {
  slug: string;
  name: string;
  description?: string;
  file: string;
  previewFile: string;
  installSlug?: string;
  previewKey: string;
  badge?: string;
  launchedAt?: string;
  usageFile?: string;
}
export interface CatalogEntry {
  slug: string;
  name: string;
  description: string;
  file: string;
  extraFiles?: string[];
  examples?: CatalogExample[];
  badge?: string;
  launchedAt?: string;
  keywords?: string[];
  usageFile?: string;
}
export interface CatalogCategory {
  slug: string;
  name: string;
  description: string;
  components: CatalogEntry[];
}

export interface ProductCatalog {
  schemaVersion: number;
  product: { name: string; version: string; description: string };
  categories: CatalogCategory[];
}
