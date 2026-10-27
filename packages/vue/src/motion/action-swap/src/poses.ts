import { EASE_OUT, SPRING_SWAP } from "../../../lib/ease";
export function swapPose(animation: "cascade" | "blur" | "roll", kind: "icon" | "text", quiet: boolean) {
  const rolling = animation !== "blur";
  const initial = rolling ? { opacity: 0, y: kind === "icon" ? 12 : "90%", filter: "blur(6px)" }
    : { opacity: 0, scale: kind === "icon" ? 0.25 : 0.96, filter: "blur(6px)" };
  const exit = rolling ? { opacity: 0, y: kind === "icon" ? -12 : "-90%", filter: "blur(6px)", transition: { duration: 0.14, ease: EASE_OUT } }
    : { opacity: 0, scale: kind === "icon" ? 0.25 : 0.96, filter: "blur(6px)", transition: { duration: 0.12, ease: EASE_OUT } };
  return { initial: quiet ? false as const : initial, animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }, exit: quiet ? undefined : exit, transition: rolling ? SPRING_SWAP : { duration: 0.18, ease: EASE_OUT } };
}
export const cascadePoses = {
  initial: { opacity: 0, y: "105%", filter: "blur(6px)" },
  animate: (offset: unknown = 0) => ({ opacity: 1, y: "0%", filter: "blur(0px)", transition: { ...SPRING_SWAP, delay: Number(offset) } }),
  exit: (offset: unknown = 0) => ({ opacity: 0, y: "-105%", filter: "blur(6px)", transition: { duration: 0.16, ease: EASE_OUT, delay: Number(offset) / 2 } }),
};
