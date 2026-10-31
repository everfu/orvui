export interface ApiDiagnostic {
  file: string;
  code: string;
  message: string;
  member?: string;
}

export interface ApiProp {
  name: string;
  type: string | null;
  required: boolean;
  defaultValue: string | null;
  defaultSource:
    | "withDefaults"
    | "destructure"
    | "fallback"
    | "jsdoc"
    | "boolean-cast"
    | null;
  description: string;
  sourceFile: string;
}

export interface ApiEvent {
  name: string;
  signature: string | null;
  declaration: "typed" | "runtime";
  description: string;
}

export interface ApiSlot {
  name: string;
  signature: string | null;
  declaration: "typed" | "template";
  bindings: { name: string; expression: string }[];
  description: string;
}

export interface ApiComponent {
  displayName: string;
  aliases: string[];
  file: string;
  props: ApiProp[];
  events: ApiEvent[];
  slots: ApiSlot[];
  diagnostics: ApiDiagnostic[];
}

export interface ApiComposition {
  demoFile: string;
  primaryFile: string | null;
  sourceFiles: string[];
  components: ApiComponent[];
}

export interface ApiEntry {
  category: string;
  slug: string;
  default: ApiComposition;
  variants: Record<string, ApiComposition>;
  publicComponents: string[];
}

export interface ComponentDocs {
  schemaVersion: 1;
  productVersion: string;
  entries: Record<string, ApiEntry>;
  components: Record<string, ApiComponent>;
  diagnostics: ApiDiagnostic[];
  summary: {
    entries: number;
    variants: number;
    publicComponents: number;
    uniqueSfcFiles: number;
    props: number;
    events: number;
    slots: number;
    diagnostics: number;
  };
}
