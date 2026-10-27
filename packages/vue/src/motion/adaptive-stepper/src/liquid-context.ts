import type { InjectionKey, Ref } from "vue";
interface LiquidSurfaceContext { root: Ref<HTMLElement | null>; portal: Ref<SVGGElement | null> }
export const LiquidContext: InjectionKey<LiquidSurfaceContext> = Symbol("orvui-liquid");
