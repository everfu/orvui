import { computed, defineComponent, h, inject, unref, type Ref } from "vue";
import { cn } from "../../../lib/utils";

/** Static card regions share the provider's responsive inset contract. */
export function createCardPart(name: string, tag: string, slot: string, base: string, padded = false) {
  return defineComponent({ name, inheritAttrs: false, setup(_, { attrs, slots }) {
    const size = padded ? inject<Ref<string> | string>("orvui-card-size", "default") : "default";
    const inset = computed(() => padded ? unref(size) === "default" ? "px-6" : "px-4" : undefined);
    return () => h(tag, { ...attrs, "data-slot": slot, class: cn(base, inset.value, attrs.class as string) }, slots.default?.());
  } });
}
