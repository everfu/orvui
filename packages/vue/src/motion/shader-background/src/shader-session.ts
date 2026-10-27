import { ShaderMount, emptyPixel, type ShaderMountUniforms } from "@paper-design/shaders";
import type { shaderFactories } from "./presets";
type Configuration = ReturnType<(typeof shaderFactories)[keyof typeof shaderFactories]>;
type Options = {
  speed: number; minPixelRatio?: number; maxPixelCount?: number;
  webGlContextAttributes?: WebGLContextAttributes; mipmaps?: string[];
};

/** One GPU owner; stale image work cannot replace the current scene. */
export function createShaderSession(reportFailure: (failed: boolean) => void) {
  let renderer: ShaderMount | undefined;
  let program: string | undefined;
  let frame: number | undefined;
  let revision = 0;
  let disposed = false;
  const assets = new Map<string, { promise: Promise<HTMLImageElement>; cancel: () => void }>();
  function image(url: string) {
    const cached = assets.get(url);
    if (cached) return cached.promise;
    const element = new Image();
    let rejectPending: (error: Error) => void = () => {};
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      rejectPending = reject;
      element.crossOrigin = "anonymous";
      element.onload = () => { element.onload = element.onerror = null; resolve(element); };
      element.onerror = () => { element.onload = element.onerror = null; reject(new Error("Shader texture unavailable")); };
      element.src = url || emptyPixel;
    });
    const entry = { promise, cancel() {
      element.onload = element.onerror = null;
      rejectPending(new Error("Shader texture released"));
    } };
    assets.set(url, entry);
    return promise;
  }
  function releaseRenderer() { renderer?.dispose(); renderer = undefined; program = undefined; frame = undefined; }
  async function update(root: HTMLElement, config: Configuration, options: Options) {
    const token = ++revision;
    const current = () => !disposed && token === revision;
    try {
      const entries = await Promise.all(Object.entries(config.uniforms).map(async ([key, value]) => [key, typeof value === "string" ? await image(value) : value]));
      if (!current()) return;
      const uniforms = Object.fromEntries(entries) as ShaderMountUniforms;
      if (!renderer || program !== config.fragmentShader) {
        releaseRenderer();
        renderer = new ShaderMount(root, config.fragmentShader, uniforms, options.webGlContextAttributes,
          options.speed, config.frame, options.minPixelRatio, options.maxPixelCount, options.mipmaps);
        program = config.fragmentShader; frame = config.frame;
      } else {
        renderer.setUniforms(uniforms);
        renderer.setSpeed(options.speed);
        renderer.setMinPixelRatio(options.minPixelRatio);
        renderer.setMaxPixelCount(options.maxPixelCount);
        if (frame !== config.frame) { renderer.setFrame(config.frame); frame = config.frame; }
      }
      reportFailure(false);
    } catch {
      if (current()) { releaseRenderer(); reportFailure(true); }
    }
  }
  return { update, get renderer() { return renderer; }, dispose() {
    disposed = true; ++revision; releaseRenderer();
    assets.forEach(asset => asset.cancel()); assets.clear();
  } };
}
