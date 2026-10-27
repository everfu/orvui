import { computed, inject } from "vue";
import { messageKey, type MessageFrom } from "./context";
export function useMessageAlignment() {
  const inherited = inject(
    messageKey,
    computed<MessageFrom>(() => "assistant"),
  );
  return computed(() => inherited.value === "user");
}
