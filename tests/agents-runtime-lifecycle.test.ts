import { afterEach, describe, expect, it, vi } from "vitest";
import { createOrbRenderer } from "../packages/vue/src/agents/voice-orb/src/renderer";
import { createDitherField } from "../packages/vue/src/agents/image-generation/src/dither";
import {
  moveResource,
  renameResource,
  type SidebarResource,
} from "../packages/vue/src/agents/ai-sidebar/src/tree";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("agent rendering resource ownership", () => {
  it("releases partially compiled GPU resources when initialization fails", () => {
    const shader = {};
    const gpu = {
      VERTEX_SHADER: 1,
      COMPILE_STATUS: 2,
      createShader: vi.fn(() => shader),
      shaderSource: vi.fn(),
      compileShader: vi.fn(),
      getShaderParameter: vi.fn(() => false),
      getShaderInfoLog: vi.fn(() => "Compilation rejected"),
      deleteShader: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      gpu as unknown as WebGLRenderingContext,
    );
    const canvas = document.createElement("canvas");
    expect(() =>
      createOrbRenderer(
        canvas,
        () => ({
          activity: 0,
          speed: 1,
          animated: false,
          colors: ["#123", "#456", "#789"],
        }),
        vi.fn(),
      ),
    ).toThrow("Compilation rejected");
    expect(gpu.deleteShader).toHaveBeenCalledExactlyOnceWith(shader);
  });
  it("keeps reduced-motion lattices static and releases listeners and the resize observer", () => {
    const brush = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      globalAlpha: 1,
      fillStyle: "",
    };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      brush as unknown as CanvasRenderingContext2D,
    );
    const schedule = vi.fn();
    vi.stubGlobal("requestAnimationFrame", schedule);
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect = disconnect;
      },
    );
    const canvas = document.createElement("canvas");
    const remove = vi.spyOn(canvas, "removeEventListener");
    const dispose = createDitherField(canvas, true, true, true);
    expect(brush.arc).toHaveBeenCalled();
    expect(schedule).not.toHaveBeenCalled();
    dispose();
    dispose();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(remove.mock.calls.map(([name]) => name)).toEqual([
      "pointermove",
      "pointerleave",
    ]);
  });
  it("does not lose a resource when a move names a missing destination", () => {
    const leaf: SidebarResource = { id: "leaf", label: "Readme", kind: "file" };
    const tree: SidebarResource[] = [
      { id: "folder", label: "Folder", kind: "folder", children: [leaf] },
    ];
    expect(
      moveResource(tree, {
        itemId: "leaf",
        targetId: "missing",
        position: "before",
      }),
    ).toBeNull();
    const renamed = renameResource(tree, "leaf", "Guide");
    expect(renamed[0].children?.[0].label).toBe("Guide");
    expect(tree[0].children?.[0]).toBe(leaf);
    expect(leaf.label).toBe("Readme");
  });
});
