import type { Content } from "../../shared";
export interface CitationItem {
  id: string;
  title: Content;
  domain?: Content;
  url?: string;
  icon?: Content;
}
