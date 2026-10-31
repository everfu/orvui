import type { ComponentPublicInstance, Ref } from "vue";

export interface TableOfContentsItem {
  id: string;
  label: string;
  level?: 2 | 3;
}

/** The article scope, optionally also its scrollable viewport. */
export type TableOfContentsTarget =
  | string
  | HTMLElement
  | ComponentPublicInstance
  | Ref<HTMLElement | ComponentPublicInstance | null | undefined>
  | (() => HTMLElement | null);
