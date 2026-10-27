export const MORPH = { type: "spring", duration: 0.5, bounce: 0.22 } as const;
export const LIST = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.12 } },
};
export const ITEM = {
  hidden: { opacity: 0, y: -6, filter: "blur(3px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};
export const HEAD = "flex items-center gap-2 px-2 py-1.5 text-left";
