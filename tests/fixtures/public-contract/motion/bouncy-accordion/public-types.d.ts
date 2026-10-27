import type { BouncyAccordionProps } from "./api-types";
export type BouncyAccordionItem = BouncyAccordionProps["items"][number];
export type BouncyAccordionClassNames = Partial<Record<"root" | "item" | "trigger" | "icon" | "title" | "chevron" | "content" | "description", string>>;
