export interface PublicUsageImport {
  source: string;
  target: string;
  names: { imported: string; local: string; typeOnly: boolean }[];
}
export interface PublicUsageSnippet {
  /** Requested demo/example path, relative to the workspace root. */
  file: string;
  /** Actual content after expanding a transparent single-component wrapper. */
  resolvedFile: string;
  code: string;
  registryCode: string;
  registryInstallSlugs: string[];
  /** Versioned demo dependencies not installed by the selected registry entries. */
  registryExtraDependencies: string[];
  registryImports: (PublicUsageImport & {
    sourceFile: string;
    targetFile: string;
  })[];
  registryTargets: string[];
  imports: PublicUsageImport[];
  /** Bare packages that consumers must be able to resolve directly. */
  dependencies: string[];
}
export interface PublicUsageDiagnostic {
  file: string;
  specifier?: string;
  name?: string;
  message: string;
}
export interface PublicUsageManifest {
  schemaVersion: 1;
  productVersion: string;
  entries: Record<
    string,
    {
      default: PublicUsageSnippet;
      variants: Record<string, PublicUsageSnippet>;
    }
  >;
  files: Record<string, PublicUsageSnippet>;
  diagnostics: PublicUsageDiagnostic[];
  summary: {
    entries: number;
    variants: number;
    files: number;
    wrappersExpanded: number;
    publicModules: number;
    publicExports: number;
  };
}
