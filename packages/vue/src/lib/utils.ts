import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: unknown[]) {
  const combined = clsx(...inputs as ClassValue[]);
  return twMerge(combined);
}
export function clamp(value: number, min: number, max: number) {
  const aboveFloor = Math.max(min, value);
  return Math.min(aboveFloor, max);
}
