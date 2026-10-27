import { h, type VNode, type VNodeChild } from "vue";
import { motion } from "motion-v";
import { EASE_IN_OUT } from "../../../lib/ease";
import { BAYER_4, MORPH_PATHS, MORPH_ROT, MORPH_SCALE, MORPH_SEQ } from "./model";
import { asciiFrames } from "./clock";
interface LoaderVisualProps { variant: string; size: number; speed: number }
interface LoaderVisualState { frame: number; text: string; percent: number; id: string }
const px = (length: number) => `${length}px`;
const indexes = (count: number) => Array.from({ length: count }, (_, index) => index);
function moving(tag: string, props: Record<string, unknown>, children?: VNodeChild) {
  const component = (motion as any)[tag];
  return children === undefined ? h(component, props) : h(component, props, { default: () => children });
}
const span = (props: Record<string, unknown>, children?: VNodeChild) => h("span", props, children ?? undefined);
const circleClass = "rounded-full bg-current";
export function renderLoader(props: LoaderVisualProps, quiet: boolean, state: LoaderVisualState): VNode {
  const { size, speed, variant } = props;
  const loop = { duration: speed, ease: EASE_IN_OUT, repeat: Infinity };
  const pulse = { opacity: [1, 0.4, 1] };
  const pulseLoop = { duration: 1.4, ease: EASE_IN_OUT, repeat: Infinity };
  const frames = asciiFrames[variant];
  if (frames) return span({ "aria-hidden": true, class: "font-mono leading-none tabular-nums", style: { fontSize: px(size), lineHeight: 1 } }, frames[state.frame % frames.length]);
  if (variant === "scramble") return span({ "aria-hidden": true, class: "font-mono font-medium tracking-[.2em] tabular-nums", style: { fontSize: px(size * 0.42) } }, state.text);
  if (variant === "percent") return span({ "aria-hidden": true, class: "flex flex-col items-center", style: { gap: px(size * 0.14), width: px(size * 1.4) } }, [
    span({ class: "font-mono font-medium tabular-nums", style: { fontSize: px(size * 0.42), lineHeight: 1 } }, `${state.percent}%`),
    span({ class: "w-full overflow-hidden rounded-full bg-current/15", style: { height: px(Math.max(3, size * 0.1)) } }, span({ class: "block h-full rounded-full bg-current", style: { width: `${state.percent}%` } })),
  ]);
  if (variant === "dots") return span({ "aria-hidden": true, class: "flex items-center", style: { gap: px(size * 0.14) } }, indexes(3).map(index => moving("span", {
    key: index, class: circleClass, style: { width: px(size * 0.24), height: px(size * 0.24) },
    animate: quiet ? { opacity: [0.4, 1, 0.4] } : { y: [0, -size * 0.3, 0], opacity: [0.5, 1, 0.5] }, transition: { ...loop, delay: index * speed * 0.16 },
  })));
  if (variant === "bars") return span({ "aria-hidden": true, class: "flex items-center", style: { gap: px(size * 0.1), height: px(size) } }, indexes(4).map(index => moving("span", {
    key: index, class: circleClass, style: { width: px(size * 0.16), height: px(size), transformOrigin: "bottom" },
    animate: quiet ? { opacity: [0.4, 1, 0.4] } : { scaleY: [0.3, 1, 0.3] }, transition: { ...loop, delay: index * speed * 0.12 },
  })));
  if (variant === "dot-matrix" || variant === "dither") {
    const matrix = variant === "dot-matrix", count = matrix ? 3 : 4;
    const gap = matrix ? size * 0.14 : Math.max(1, size * 0.05);
    const cell = (size - gap * (count - 1)) / count;
    const values = matrix ? indexes(9) : BAYER_4;
    return span({ "aria-hidden": true, class: "grid", style: { gap: px(gap), gridTemplateColumns: `repeat(${count},${cell}px)` } }, values.map((order, index) => moving("span", {
      key: index, class: matrix ? circleClass : "bg-current", style: { width: px(cell), height: px(cell) },
      animate: quiet ? { opacity: [0.3, 1, 0.3] } : matrix ? { opacity: [0.2, 1, 0.2], scale: [0.7, 1, 0.7] } : { opacity: [0.1, 1, 0.1] },
      transition: { ...loop, delay: speed * (matrix ? ((index % 3) + Math.floor(index / 3)) / 4 : order / 16) },
    })));
  }
  if (variant === "morph") return moving("svg", { width: size, height: size, viewBox: "0 0 100 100", "aria-hidden": true,
    animate: quiet ? pulse : { rotate: MORPH_ROT, scale: MORPH_SCALE }, transition: quiet ? pulseLoop : { ...loop, duration: speed * 5 },
  }, moving("path", { fill: "currentColor", d: MORPH_PATHS[0], animate: quiet ? undefined : { d: MORPH_SEQ }, transition: quiet ? undefined : { ...loop, duration: speed * 5 } }));
  if (variant === "comet") return span({ "aria-hidden": true, class: "relative", style: { width: px(size), height: px(size) } }, moving("span", {
    class: "absolute inset-0", animate: quiet ? pulse : { rotate: 360 }, transition: quiet ? pulseLoop : { duration: speed, ease: "linear", repeat: Infinity },
  }, indexes(6).map(index => {
    const diameter = size * 0.2 * (1 - index * 0.13);
    return span({ key: index, class: "absolute left-1/2 top-1/2 rounded-full bg-current", style: {
      width: px(diameter), height: px(diameter), marginLeft: px(-diameter / 2), marginTop: px(-diameter / 2),
      opacity: 1 - index * 0.16, transform: `rotate(${-15 * index}deg) translateY(${-size * 0.4}px)`,
    } });
  })));
  if (variant === "metaballs") return h("svg", { width: size, height: size, viewBox: "0 0 100 100", "aria-hidden": true }, [
    h("defs", [h("filter", { id: state.id }, [h("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "5", result: "b" }), h("feColorMatrix", { in: "b", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" })])]),
    h("g", { filter: `url(#${state.id})`, fill: "currentColor" }, [0, 1].map(side => moving("circle", {
      key: side, cy: "50", r: "15", cx: quiet ? 40 + 20 * side : 30 + 40 * side,
      animate: quiet ? { opacity: [0.4, 1, 0.4] } : { cx: side ? [70, 30, 70] : [30, 70, 30] }, transition: { ...loop, duration: speed * 1.6 },
    }))),
  ]);
  if (variant === "newton") return span({ "aria-hidden": true, class: "flex items-center justify-center", style: { height: px(size * 0.2) } }, indexes(5).map(index => moving("span", {
    key: index, class: circleClass, style: { width: px(size * 0.2), height: px(size * 0.2) },
    animate: quiet ? undefined : index === 0 ? { x: [0, -size * 0.22, 0, 0] } : index === 4 ? { x: [0, 0, size * 0.22, 0] } : undefined,
    transition: quiet || (index !== 0 && index !== 4) ? undefined : { duration: speed * 1.5, ease: EASE_IN_OUT, repeat: Infinity, times: index === 0 ? [0, 0.28, 0.5, 1] : [0, 0.5, 0.78, 1] },
  })));
  if (variant === "helix") return span({ "aria-hidden": true, class: "relative", style: { width: px(size), height: px(size) } }, indexes(7).map(row => span({ key: row }, [0, 1].map(side => moving("span", {
    key: side, class: "absolute rounded-full bg-current", style: { width: px(size * 0.14), height: px(size * 0.14), left: px(size * 0.43), top: px(row / 6 * (size - size * 0.14)) },
    animate: quiet ? { opacity: [0.4, 1, 0.4] } : {
      x: side ? [-size * 0.32, size * 0.32, -size * 0.32] : [size * 0.32, -size * 0.32, size * 0.32],
      scale: side ? [0.5, 1, 0.5] : [1, 0.5, 1], opacity: side ? [0.45, 1, 0.45] : [1, 0.45, 1],
    }, transition: { ...loop, delay: row * speed / 7 },
  })))));
  const stroke = Math.max(2, size * 0.09), radius = (size - stroke) / 2;
  return moving("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, "aria-hidden": true,
    animate: quiet ? pulse : { rotate: 360 }, transition: quiet ? pulseLoop : { duration: speed, ease: "linear", repeat: Infinity },
  }, [h("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: "currentColor", "stroke-opacity": ".2", "stroke-width": stroke }),
    h("path", { d: `M ${size / 2} ${size / 2 - radius} A ${radius} ${radius} 0 0 1 ${size / 2 + radius} ${size / 2}`, fill: "none", stroke: "currentColor", "stroke-width": stroke, "stroke-linecap": "round" })]);
}
