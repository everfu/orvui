import {
  computed,
  inject,
  provide,
  ref,
  type InjectionKey,
  type Ref,
} from "vue";

export function createTemplateContext(
  en: Ref<boolean> = ref(false),
  docsOrigin = "https://orvui.efu.me",
) {
  return {
    en: computed(() => en.value),
    t: (zh: string, english: string) => (en.value ? english : zh),
    routeTo: (category: string, slug?: string) =>
      `${docsOrigin}${en.value ? "/en" : ""}/${category === "charts" ? "charts" : `components/${category}`}${slug ? "/" + slug : ""}`,
  };
}
const key: InjectionKey<ReturnType<typeof createTemplateContext>> = Symbol(
  "orvui-template-context",
);
export function provideTemplateContext(en: Ref<boolean>, docsOrigin?: string) {
  const context = createTemplateContext(en, docsOrigin);
  provide(key, context);
  return context;
}
export function useTemplateContext() {
  return inject(key) ?? createTemplateContext();
}
