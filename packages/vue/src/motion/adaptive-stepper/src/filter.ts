import { h } from "vue";
export function liquidFilter(id: string, width: number, height: number) {
  const padding = 48;
  return h("filter", { id, x: -padding, y: -padding, width: width + 2 * padding, height: height + 2 * padding, filterUnits: "userSpaceOnUse", "color-interpolation-filters": "sRGB" }, [
    h("feGaussianBlur", { in: "SourceGraphic", stdDeviation: 8, result: "blur" }),
    h("feColorMatrix", { in: "blur", type: "matrix", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8.67", result: "goo" }),
    h("feComposite", { in: "SourceGraphic", in2: "goo", operator: "atop", result: "shape" }),
    h("feColorMatrix", { in: "shape", type: "matrix", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -29.5", result: "solid-shape" }),
    h("feMorphology", { in: "solid-shape", operator: "erode", radius: "1", result: "inset-shape" }),
    h("feComposite", { in: "solid-shape", in2: "inset-shape", operator: "out", result: "edge-mask" }),
    h("feFlood", { "flood-color": "var(--foreground)", "flood-opacity": "0.08", result: "edge-color" }),
    h("feComposite", { in: "edge-color", in2: "edge-mask", operator: "in", result: "edge" }),
    h("feMerge", [h("feMergeNode", { in: "shape" }), h("feMergeNode", { in: "edge" })]),
  ]);
}
