import { type Ref } from "vue";
export type ThemeVariant = "rectangle" | "circle" | "circle-blur" | "blinds";
export type RectStart = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "bottom-up";
export declare function useThemeToggle(options?: {
    variant?: ThemeVariant;
    start?: RectStart;
}): {
    isDark: Ref<boolean, boolean>;
    mounted: Ref<boolean, boolean>;
    toggle: () => void;
    applyTheme: (next: "light" | "dark", animate?: boolean) => void;
};
