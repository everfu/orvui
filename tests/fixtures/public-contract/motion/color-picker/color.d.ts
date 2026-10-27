export type Hsva = {
    h: number;
    s: number;
    v: number;
    a: number;
};
export type Rgba = {
    r: number;
    g: number;
    b: number;
    a: number;
};
export declare function hsvaToRgba(color: Hsva): Rgba;
export declare function rgbaToHsva(color: Rgba, previous?: Hsva): Hsva;
export declare function parseHex(input: string): Rgba | null;
export declare function formatHex(color: Rgba): string;
export declare function hsvToHsl(color: Hsva): {
    h: number;
    s: number;
    l: number;
};
export declare function hslToHsv(h: number, s: number, l: number, previous: Hsva, a: number): Hsva;
