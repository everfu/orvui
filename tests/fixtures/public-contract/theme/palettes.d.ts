export type ColorTheme = "default" | "violet" | "blue" | "green" | "amber" | "blood-orange" | "rose" | "red" | "teal" | "indigo" | "lime";
export type ThemeVars = Record<string, string>;
export type Theme = {
    name: string;
    swatch: string;
    light: ThemeVars;
    dark: ThemeVars;
};
export declare const THEMES: Record<ColorTheme, Theme>;
export declare const THEME_LIST: {
    id: ColorTheme;
    name: string;
    swatch: string;
}[];
export declare function themeExportCss(id: ColorTheme): string;
export declare function themesStylesheet(): string;
