import { inject, type ComputedRef, type InjectionKey, type Ref, type ShallowRef } from "vue";
import type { MotionValue } from "motion-v";
export interface TabsState { value: Ref<string>; id: string; variant: ComputedRef<"pill" | "underline" | "segment">; icons: ComputedRef<"always" | "selected">; track: Record<"x" | "y" | "width" | "height", MotionValue<number>>; placed: Ref<boolean>; tabStop: ComputedRef<string | null>; tabs: ShallowRef<Map<string, boolean>>; panels: ShallowRef<Set<string>>; registerTab: (value: string, disabled: boolean) => void; unregisterTab: (value: string) => void; registerPanel: (value: string) => void; unregisterPanel: (value: string) => void; tabId: (value: string) => string; panelId: (value: string) => string }
export const TabsContext = Symbol("orvui-tabs") as InjectionKey<TabsState>;
export const TABS_TRANSITION = { type: "spring" as const, stiffness: 245, damping: 36, mass: 1.2 };
export function useTabs() { const state = inject(TabsContext); if (!state) throw new Error("Tabs components must be used inside Tabs"); return state; }
