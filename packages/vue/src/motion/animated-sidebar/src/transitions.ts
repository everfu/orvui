import { EASE_OUT } from "../../../lib/ease";
const closedClip = "inset(0 0 100% 0 round 8px)",
  openClip = "inset(0 0 0% 0 round 8px)";
export const submenuVariants = {
  closed: {
    opacity: 0,
    clipPath: closedClip,
    transition: {
      duration: 0.14,
      ease: EASE_OUT,
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    clipPath: openClip,
    transition: {
      duration: 0.2,
      delayChildren: 0.035,
      ease: EASE_OUT,
      staggerChildren: 0.045,
    },
  },
};
export const submenuItemVariants = {
  closed: { opacity: 0, y: -6, filter: "blur(3px)" },
  open: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.18, ease: EASE_OUT },
  },
};
