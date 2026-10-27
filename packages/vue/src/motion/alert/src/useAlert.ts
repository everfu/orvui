import { inject } from "vue";
import type { AlertContext } from "./context";
export function useAlert() {
  const state = inject<AlertContext>("orvui-alert");
  if (state === undefined) throw new Error("useAlert must be used within its provider");
  return state;
}
