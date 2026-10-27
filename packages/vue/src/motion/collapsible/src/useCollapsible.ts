import { inject } from "vue";
import type { CollapsibleContext } from "./context";
export function useCollapsible() {
  const state = inject<CollapsibleContext>("orvui-collapsible");
  if (state === undefined) throw new Error("useCollapsible must be used within its provider");
  return state;
}
