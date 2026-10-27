import { it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { ShaderBackground } from "..";

it("renders a deterministic fallback when the WebGL2 renderer cannot initialize", async () => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  const context = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null);
  const wrapper = mount(ShaderBackground, {
    props: { variant: "mesh-gradient", fallback: "linear-gradient(red,blue)" },
    slots: { fallback: "Graphics unavailable" },
  });
  try {
    await flushPromises();
    expect(wrapper.text()).toBe("Graphics unavailable");
    expect(wrapper.attributes("style")).toContain("linear-gradient");
    expect(context.mock.calls.some((call) => call[0] === "webgl2")).toBe(true);
  } finally {
    wrapper.unmount();
    context.mockRestore();
  }
});
