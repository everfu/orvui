import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { ColorPicker } from "..";

const wrappers: VueWrapper[] = [];
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount());
  document.body.innerHTML = "";
});

function percentage(transform: string, axis: "X" | "Y") {
  const single = transform.match(new RegExp(`translate${axis}\\((-?[\\d.]+)%\\)`));
  if (single) return Number(single[1]);
  const combined = transform.match(/translate(?:3d)?\((-?[\d.]+)%,\s*(-?[\d.]+)%/);
  return combined ? Number(combined[axis === "X" ? 1 : 2]) : Number.NaN;
}

describe("color picker initial thumb positions", () => {
  it.each([
    { label: "Hue", value: "#408080", x: 50 },
    { label: "Opacity", value: "#408080", x: 100 },
    { label: "Opacity", value: "#40808080", x: 50 },
    { label: "Saturation and brightness", value: "#408080", x: 50, y: 100 - 128 / 255 * 100 },
  ])("positions $label immediately for $value", ({ label, value, x, y }) => {
    const wrapper = mount(ColorPicker, { props: { modelValue: value, alpha: true }, attachTo: document.body });
    wrappers.push(wrapper);
    const slider = wrapper.get(`[role="slider"][aria-label="${label}"]`).element;
    const transform = (slider.parentElement as HTMLElement).style.transform;
    expect(transform).not.toMatch(/undefined|NaN/);
    if (y === undefined) expect(transform).not.toContain("translateY");
    expect(percentage(transform, "X"), transform).toBeCloseTo(x, 5);
    if (y !== undefined) expect(percentage(transform, "Y"), transform).toBeCloseTo(y, 5);
  });
});
