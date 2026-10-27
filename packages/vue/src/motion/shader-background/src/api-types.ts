import type { HTMLAttributes } from "vue";
import type {
  MeshGradientParams,
  GrainGradientParams,
  DotGridParams,
  DotOrbitParams,
  WarpParams,
  WavesParams,
  WaterParams,
  VoronoiParams,
  SwirlParams,
  SmokeRingParams,
  StaticRadialGradientParams,
  NeuroNoiseParams,
  MetaballsParams,
  GodRaysParams,
  SpiralParams,
  DitheringParams,
  PulsingBorderParams,
  ColorPanelsParams,
  StaticMeshGradientParams,
  SimplexNoiseParams,
  PerlinNoiseParams,
} from "@paper-design/shaders";

export interface ShaderVariantProps {
  "mesh-gradient": MeshGradientParams;
  "grain-gradient": GrainGradientParams;
  "dot-grid": DotGridParams;
  "dot-orbit": DotOrbitParams;
  warp: WarpParams;
  waves: WavesParams;
  water: WaterParams;
  voronoi: VoronoiParams;
  swirl: SwirlParams;
  "smoke-ring": SmokeRingParams;
  "static-radial-gradient": StaticRadialGradientParams;
  "neuro-noise": NeuroNoiseParams;
  metaballs: MetaballsParams;
  "god-rays": GodRaysParams;
  spiral: SpiralParams;
  dithering: DitheringParams;
  "pulsing-border": PulsingBorderParams;
  "color-panels": ColorPanelsParams;
  "static-mesh-gradient": StaticMeshGradientParams;
  "simplex-noise": SimplexNoiseParams;
  "perlin-noise": PerlinNoiseParams;
}
export type ShaderBackgroundProps = {
  [K in keyof ShaderVariantProps]: {
    variant: K;
    fallback?: string;
    minPixelRatio?: number;
    maxPixelCount?: number;
    webGlContextAttributes?: WebGLContextAttributes;
    width?: string | number;
    height?: string | number;
  } & ShaderVariantProps[K] &
    Omit<HTMLAttributes, "color">;
}[keyof ShaderVariantProps];
