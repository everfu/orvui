import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
const renderer = vi.hoisted(() => ({
  instances: [] as {
    args: unknown[];
    setUniforms: ReturnType<typeof vi.fn>;
    setSpeed: ReturnType<typeof vi.fn>;
    setFrame: ReturnType<typeof vi.fn>;
    setMinPixelRatio: ReturnType<typeof vi.fn>;
    setMaxPixelCount: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  }[],
}));
vi.mock(
  "@paper-design/shaders",
  async (importOriginal) => {
    const source = await importOriginal<Record<string, unknown>>();
    return {
      ...source,
      ShaderMount: class {
        args: unknown[];
        setUniforms = vi.fn();
        setSpeed = vi.fn();
        setFrame = vi.fn();
        setMinPixelRatio = vi.fn();
        setMaxPixelCount = vi.fn();
        dispose = vi.fn();
        constructor(...args: unknown[]) {
          this.args = args;
          renderer.instances.push(this);
        }
      },
    };
  },
);
import { ShaderBackground } from "..";
const wrappers: VueWrapper[] = [];
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  renderer.instances.splice(0);
});
describe("Shader core adapter", () => {
  it("normalizes Vue kebab attributes, preserves width/height and forwards renderer resolution controls", async () => {
    const wrapper = mount(ShaderBackground, {
      props: { variant: "dot-grid" },
      attrs: {
        "color-fill": "#ff0000",
        "max-pixel-count": 123456,
        "min-pixel-ratio": 1,
        width: 320,
        height: "180",
        "aria-label": "Pattern",
      },
    });
    wrappers.push(wrapper);
    await flushPromises();
    expect(renderer.instances).toHaveLength(1);
    const current = renderer.instances[0];
    expect(current.args[6]).toBe(1);
    expect(current.args[7]).toBe(123456);
    expect((current.args[2] as any).u_colorFill).toEqual([1, 0, 0, 1]);
    expect(wrapper.element.style.width).toBe("320px");
    expect(wrapper.element.style.height).toBe("180px");
    expect(wrapper.attributes("aria-label")).toBe("Pattern");
    expect(wrapper.attributes("color-fill")).toBeUndefined();
  });
  it("updates uniforms without restarting time, applies frame changes and disposes when changing shader or unmounting", async () => {
    const wrapper = mount(ShaderBackground, {
      props: { variant: "mesh-gradient", frame: 42 },
      attrs: { swirl: 0.2 },
    });
    wrappers.push(wrapper);
    await flushPromises();
    const first = renderer.instances[0];
    await wrapper.setProps({ swirl: 0.8 } as any);
    await flushPromises();
    expect(renderer.instances).toHaveLength(1);
    expect(first.setUniforms).toHaveBeenCalledWith(
      expect.objectContaining({ u_swirl: 0.8 }),
    );
    expect(first.setFrame).not.toHaveBeenCalled();
    await wrapper.setProps({ frame: 60 });
    await flushPromises();
    expect(first.setFrame).toHaveBeenLastCalledWith(60);
    await wrapper.setProps({ variant: "waves" });
    await flushPromises();
    expect(first.dispose).toHaveBeenCalledOnce();
    expect(renderer.instances[1].args[7]).toBe(6016 * 3384);
    wrapper.unmount();
    wrappers.pop();
    expect(renderer.instances[1].dispose).toHaveBeenCalledOnce();
  });
});

it("does not mount an obsolete texture request after switching the active shader", async () => {
  const pending: { onload: null | (() => void); onerror: null | (() => void); src: string; crossOrigin: string }[] = [];
  vi.stubGlobal("Image", class {
    onload: null | (() => void) = null;
    onerror: null | (() => void) = null;
    crossOrigin = "";
    src = "";
    constructor() { pending.push(this); }
  });
  try {
    const wrapper = mount(ShaderBackground, { props: { variant: "water" }, attrs: { image: "/texture-a.png" } });
    wrappers.push(wrapper);
    await flushPromises();
    expect(renderer.instances).toHaveLength(0);
    expect(pending[0].src).toBe("/texture-a.png");
    await wrapper.setProps({ variant: "mesh-gradient" });
    await flushPromises();
    expect(renderer.instances).toHaveLength(1);
    pending[0].onload?.();
    await flushPromises();
    expect(renderer.instances).toHaveLength(1);
    expect(renderer.instances[0].dispose).not.toHaveBeenCalled();
    wrapper.unmount(); wrappers.pop();
    expect(renderer.instances[0].dispose).toHaveBeenCalledOnce();
  } finally { vi.unstubAllGlobals(); }
});

it("releases pending image handlers on unmount without constructing a GPU renderer", async () => {
  const pending: { onload: null | (() => void); onerror: null | (() => void) }[] = [];
  vi.stubGlobal("Image", class {
    onload: null | (() => void) = null;
    onerror: null | (() => void) = null;
    crossOrigin = ""; src = "";
    constructor() { pending.push(this); }
  });
  try {
    const wrapper = mount(ShaderBackground, { props: { variant: "water" }, attrs: { image: "/pending.png" } });
    wrappers.push(wrapper);
    await flushPromises();
    wrapper.unmount(); wrappers.pop();
    await flushPromises();
    expect(pending[0].onload).toBeNull();
    expect(pending[0].onerror).toBeNull();
    expect(renderer.instances).toHaveLength(0);
  } finally { vi.unstubAllGlobals(); }
});
