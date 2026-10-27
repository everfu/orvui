export interface NumberTickerProps {
    value: number;
    pad?: number;
    decimals?: number;
    decimalPlaces?: number;
    duration?: number;
    stagger?: number;
    startOnView?: boolean;
    prefix?: string;
    suffix?: string;
    blur?: boolean;
    className?: string;
    digitClassName?: string;
    locale?: boolean;
    format?: (value: number) => string;
}
export type DigitSwapDirection = "up" | "down";
export interface DigitSwapProps {
    value: string | number;
    animationKey?: string | number;
    replayKey?: string | number;
    direction?: DigitSwapDirection;
    duration?: number;
    stagger?: number;
    suffixLength?: number;
    className?: string;
    glyphClassName?: string;
    suffixClassName?: string;
    suffix?: string;
}
export interface AnimatedNumberProps {
    value: number;
    duration?: number;
    format?: (n: number) => string;
    className?: string;
    startOnView?: boolean;
}
