/** orvui uniform adapter. The GPU programs remain licensed Paper Design dependencies. */
import * as Shaders from "@paper-design/shaders";
type Input = Record<string, any>;
type Spec = {
  sizing: "object" | "pattern"; shader: string; params: Input;
  enums?: Record<string, Record<string, number>>; names?: Record<string, string>;
  noise?: boolean; static?: boolean;
};
// Numerical defaults are frozen appearance/API data; the compiler below owns conversion.
const specifications = {
  "mesh-gradient": { sizing: "object", shader: Shaders.meshGradientFragmentShader, params: { speed: 1, frame: 0, colors: ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"], distortion: 0.8, swirl: 0.1, grainMixer: 0, grainOverlay: 0, } },
  "grain-gradient": { sizing: "object", shader: Shaders.grainGradientFragmentShader, params: { speed: 1, frame: 0, colorBack: "#000000", colors: ["#7300ff", "#eba8ff", "#00bfff", "#2a00ff"], softness: 0.5, intensity: 0.5, noise: 0.25, shape: "corners", }, enums: {shape: Shaders.GrainGradientShapes}, noise: true },
  "dot-grid": { sizing: "pattern", shader: Shaders.dotGridFragmentShader, params: { colorBack: "#000000", colorFill: "#ffffff", colorStroke: "#ffaa00", size: 2, gapX: 32, gapY: 32, strokeWidth: 0, sizeRange: 0, opacityRange: 0, shape: "circle", }, enums: {shape: Shaders.DotGridShapes}, static: true, names: { size: "dotSize" } },
  "dot-orbit": { sizing: "pattern", shader: Shaders.dotOrbitFragmentShader, params: { speed: 1.5, frame: 0, colorBack: "#000000", colors: ["#ffc96b", "#ff6200", "#ff2f00", "#421100", "#1a0000"], size: 1, sizeRange: 0, spreading: 1, stepsPerColor: 4, }, noise: true },
  "warp": { sizing: "pattern", shader: Shaders.warpFragmentShader, params: { rotation: 0, speed: 1, frame: 0, colors: ["#121212", "#9470ff", "#121212", "#8838ff"], proportion: 0.45, softness: 1, distortion: 0.25, swirl: 0.8, swirlIterations: 10, shapeScale: 0.1, shape: "checks", }, enums: {shape: Shaders.WarpPatterns}, noise: true },
  "waves": { sizing: "pattern", shader: Shaders.wavesFragmentShader, params: { scale: 0.6, colorFront: "#ffbb00", colorBack: "#000000", shape: 0, frequency: 0.5, amplitude: 0.5, spacing: 1.2, proportion: 0.1, softness: 0, }, static: true },
  "water": { sizing: "object", shader: Shaders.waterFragmentShader, params: { scale: 0.8, speed: 1, frame: 0, colorBack: "#909090", colorHighlight: "#ffffff", highlights: 0.07, layering: 0.5, edges: 0.8, waves: 0.3, caustic: 0.1, size: 1, } },
  "voronoi": { sizing: "pattern", shader: Shaders.voronoiFragmentShader, params: { speed: 0.5, frame: 0, colors: ["#ff8247", "#ffe53d"], stepsPerColor: 3, colorGlow: "#ffffff", colorGap: "#2e0000", distortion: 0.4, gap: 0.04, glow: 0, scale: 0.5, }, noise: true },
  "swirl": { sizing: "object", shader: Shaders.swirlFragmentShader, params: { speed: 0.32, frame: 0, colorBack: "#330000", colors: ["#ffd1d1", "#ff8a8a", "#660000"], bandCount: 4, twist: 0.1, center: 0.2, proportion: 0.5, softness: 0, noiseFrequency: 0.4, noise: 0.2, } },
  "smoke-ring": { sizing: "object", shader: Shaders.smokeRingFragmentShader, params: { speed: 0.5, frame: 0, colorBack: "#000000", colors: ["#ffffff"], noiseScale: 3, noiseIterations: 8, radius: 0.25, thickness: 0.65, innerShape: 0.7, scale: 0.8, }, noise: true },
  "static-radial-gradient": { sizing: "object", shader: Shaders.staticRadialGradientFragmentShader, params: { scale: 1, speed: 0, frame: 0, colorBack: "#000000", colors: ["#00bbff", "#00ffe1", "#ffffff"], radius: 0.8, focalDistance: 0.99, focalAngle: 0, falloff: 0.24, mixing: 0.5, distortion: 0, distortionShift: 0, distortionFreq: 12, grainMixer: 0, grainOverlay: 0, } },
  "neuro-noise": { sizing: "pattern", shader: Shaders.neuroNoiseFragmentShader, params: { speed: 1, frame: 0, colorFront: "#ffffff", colorMid: "#47a6ff", colorBack: "#000000", brightness: 0.05, contrast: 0.3, } },
  "metaballs": { sizing: "object", shader: Shaders.metaballsFragmentShader, params: { scale: 1, speed: 1, frame: 0, colorBack: "#000000", colors: ["#6e33cc", "#ff5500", "#ffc105", "#ffc800", "#f585ff"], count: 10, size: 0.83, }, noise: true },
  "god-rays": { sizing: "object", shader: Shaders.godRaysFragmentShader, params: { offsetX: 0, offsetY: -0.55, colorBack: "#000000", colorBloom: "#0000ff", colors: ["#a600ff6e", "#6200fff0", "#ffffff", "#33fff5"], density: 0.3, spotty: 0.3, midIntensity: 0.4, midSize: 0.2, intensity: 0.8, bloom: 0.4, speed: 0.75, frame: 0, }, noise: true },
  "spiral": { sizing: "pattern", shader: Shaders.spiralFragmentShader, params: { scale: 1, colorBack: "#001429", colorFront: "#79D1FF", density: 1, distortion: 0, strokeWidth: 0.5, strokeTaper: 0, strokeCap: 0, noise: 0, noiseFrequency: 0, softness: 0, speed: 1, frame: 0, } },
  "dithering": { sizing: "pattern", shader: Shaders.ditheringFragmentShader, params: { speed: 1, frame: 0, scale: 0.6, colorBack: "#000000", colorFront: "#00b2ff", shape: "sphere", type: "4x4", size: 2, }, enums: {shape: Shaders.DitheringShapes, type: Shaders.DitheringTypes}, names: { size: "pxSize" } },
  "pulsing-border": { sizing: "object", shader: Shaders.pulsingBorderFragmentShader, params: { speed: 1, frame: 0, scale: 0.6, colorBack: "#000000", colors: ["#0dc1fd", "#d915ef", "#ff3f2ecc"], roundness: 0.25, thickness: 0.1, margin: 0, marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0, aspectRatio: "auto", softness: 0.75, intensity: 0.2, bloom: 0.25, spots: 5, spotSize: 0.5, pulse: 0.25, smoke: 0.3, smokeSize: 0.6, }, enums: {aspectRatio: Shaders.PulsingBorderAspectRatios}, noise: true },
  "color-panels": { sizing: "object", shader: Shaders.colorPanelsFragmentShader, params: { speed: 0.5, frame: 0, colors: [ "#ff9d00", "#fd4f30", "#809bff", "#6d2eff", "#333aff", "#f15cff", "#ffd557", ], colorBack: "#000000", angle1: 0, angle2: 0, length: 1.1, edges: false, blur: 0, fadeIn: 1, fadeOut: 0.3, gradient: 0, density: 3, scale: 0.8, } },
  "static-mesh-gradient": { sizing: "object", shader: Shaders.staticMeshGradientFragmentShader, params: { rotation: 270, speed: 0, frame: 0, colors: ["#ffad0a", "#6200ff", "#e2a3ff", "#ff99fd"], positions: 2, waveX: 1, waveXShift: 0.6, waveY: 1, waveYShift: 0.21, mixing: 0.93, grainMixer: 0, grainOverlay: 0, } },
  "simplex-noise": { sizing: "pattern", shader: Shaders.simplexNoiseFragmentShader, params: { scale: 0.6, speed: 0.5, frame: 0, colors: ["#4449CF", "#FFD1E0", "#F94446", "#FFD36B", "#FFFFFF"], stepsPerColor: 2, softness: 0, } },
  "perlin-noise": { sizing: "pattern", shader: Shaders.perlinNoiseFragmentShader, params: { speed: 0.5, frame: 0, colorBack: "#632ad5", colorFront: "#fccff7", proportion: 0.35, softness: 0.1, octaveCount: 1, persistence: 1, lacunarity: 1.5, } },
} satisfies Record<string, Spec>;
export type ShaderBackgroundVariant = keyof typeof specifications;
export const SHADER_BACKGROUND_VARIANTS = Object.keys(specifications) as ShaderBackgroundVariant[];
const sizingKeys = ["fit", "rotation", "scale", "offsetX", "offsetY", "originX", "originY", "worldWidth", "worldHeight"];
function compile(variant: ShaderBackgroundVariant, input: Input) {
  const spec: Spec = specifications[variant];
  const values: Input = { ...(spec.sizing === "object" ? Shaders.defaultObjectSizing : Shaders.defaultPatternSizing), ...spec.params };
  for (const [key, value] of Object.entries(input)) if (value !== undefined) values[key] = value;
  if (variant === "water") {
    values.image ??= "";
    if (input.size === undefined && input.effectScale !== undefined) values.size = 10 / 9 / input.effectScale - 1 / 9;
  }
  if (variant === "pulsing-border") for (const side of ["Left", "Right", "Top", "Bottom"]) {
    const key = `margin${side}`;
    if (input[key] === undefined && input.margin != null) values[key] = input.margin;
  }
  if (variant === "perlin-noise") for (const key of ["softness", "octaveCount", "persistence", "lacunarity"]) values[key] ??= spec.params[key];
  const fields = new Set([...sizingKeys, ...Object.keys(spec.params), ...(variant === "water" ? ["image"] : [])]);
  const uniforms: Input = {};
  for (const key of fields) {
    if (["speed", "frame", "margin"].includes(key)) continue;
    const value = values[key];
    const name = `u_${spec.names?.[key] ?? key}`;
    if (key === "colors") {
      uniforms[name] = value.map(Shaders.getShaderColorFromString);
      uniforms.u_colorsCount = value.length;
    } else if (key.startsWith("color")) uniforms[name] = Shaders.getShaderColorFromString(value);
    else if (key === "fit") uniforms[name] = (Shaders.ShaderFitOptions as Record<string, number>)[value];
    else if (spec.enums?.[key]) uniforms[name] = spec.enums[key][value];
    else uniforms[name] = value;
  }
  if (spec.noise) uniforms.u_noiseTexture = Shaders.getShaderNoiseTexture();
  return { uniforms, fragmentShader: spec.shader, speed: spec.static ? 0 : values.speed, frame: spec.static ? input.frame ?? 0 : values.frame };
}
export const shaderFactories = Object.fromEntries(SHADER_BACKGROUND_VARIANTS.map(variant => [variant, (input: Input) => compile(variant, input)])) as Record<ShaderBackgroundVariant, (input: Input) => ReturnType<typeof compile>>;
