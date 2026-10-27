declare function make_mesh_gradient(input: Record<string, any>): {
    uniforms: {
        u_colors: any;
        u_colorsCount: any;
        u_distortion: any;
        u_swirl: any;
        u_grainMixer: any;
        u_grainOverlay: any;
        u_fit: number;
        u_rotation: any;
        u_scale: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_grain_gradient(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colors: any;
        u_colorsCount: any;
        u_softness: any;
        u_intensity: any;
        u_noise: any;
        u_shape: number;
        u_noiseTexture: HTMLImageElement | undefined;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_dot_grid(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colorFill: [
            number,
            number,
            number,
            number
        ];
        u_colorStroke: [
            number,
            number,
            number,
            number
        ];
        u_dotSize: any;
        u_gapX: any;
        u_gapY: any;
        u_strokeWidth: any;
        u_sizeRange: any;
        u_opacityRange: any;
        u_shape: number;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: number;
    frame: any;
};
declare function make_dot_orbit(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colors: any;
        u_colorsCount: any;
        u_size: any;
        u_sizeRange: any;
        u_spreading: any;
        u_stepsPerColor: any;
        u_noiseTexture: HTMLImageElement | undefined;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_warp(input: Record<string, any>): {
    uniforms: {
        u_colors: any;
        u_colorsCount: any;
        u_proportion: any;
        u_softness: any;
        u_distortion: any;
        u_swirl: any;
        u_swirlIterations: any;
        u_shapeScale: any;
        u_shape: number;
        u_noiseTexture: HTMLImageElement | undefined;
        u_scale: any;
        u_rotation: any;
        u_fit: number;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_waves(input: Record<string, any>): {
    uniforms: {
        u_colorFront: [
            number,
            number,
            number,
            number
        ];
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_shape: any;
        u_frequency: any;
        u_amplitude: any;
        u_spacing: any;
        u_proportion: any;
        u_softness: any;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: number;
    frame: any;
};
declare function make_water(input: Record<string, any>): {
    uniforms: {
        u_image: any;
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colorHighlight: [
            number,
            number,
            number,
            number
        ];
        u_highlights: any;
        u_layering: any;
        u_waves: any;
        u_edges: any;
        u_caustic: any;
        u_size: any;
        u_fit: number;
        u_rotation: any;
        u_scale: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_voronoi(input: Record<string, any>): {
    uniforms: {
        u_colors: any;
        u_colorsCount: any;
        u_stepsPerColor: any;
        u_colorGlow: [
            number,
            number,
            number,
            number
        ];
        u_colorGap: [
            number,
            number,
            number,
            number
        ];
        u_distortion: any;
        u_gap: any;
        u_glow: any;
        u_noiseTexture: HTMLImageElement | undefined;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_swirl(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colors: any;
        u_colorsCount: any;
        u_bandCount: any;
        u_twist: any;
        u_center: any;
        u_proportion: any;
        u_softness: any;
        u_noiseFrequency: any;
        u_noise: any;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_smoke_ring(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colors: any;
        u_colorsCount: any;
        u_noiseScale: any;
        u_thickness: any;
        u_radius: any;
        u_innerShape: any;
        u_noiseIterations: any;
        u_noiseTexture: HTMLImageElement | undefined;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_static_radial_gradient(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colors: any;
        u_colorsCount: any;
        u_radius: any;
        u_focalDistance: any;
        u_focalAngle: any;
        u_falloff: any;
        u_mixing: any;
        u_distortion: any;
        u_distortionShift: any;
        u_distortionFreq: any;
        u_grainMixer: any;
        u_grainOverlay: any;
        u_fit: number;
        u_rotation: any;
        u_scale: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_neuro_noise(input: Record<string, any>): {
    uniforms: {
        u_colorFront: [
            number,
            number,
            number,
            number
        ];
        u_colorMid: [
            number,
            number,
            number,
            number
        ];
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_brightness: any;
        u_contrast: any;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_metaballs(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colors: any;
        u_colorsCount: any;
        u_size: any;
        u_count: any;
        u_noiseTexture: HTMLImageElement | undefined;
        u_fit: number;
        u_rotation: any;
        u_scale: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_god_rays(input: Record<string, any>): {
    uniforms: {
        u_colorBloom: [
            number,
            number,
            number,
            number
        ];
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colors: any;
        u_colorsCount: any;
        u_density: any;
        u_spotty: any;
        u_midIntensity: any;
        u_midSize: any;
        u_intensity: any;
        u_bloom: any;
        u_noiseTexture: HTMLImageElement | undefined;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_spiral(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colorFront: [
            number,
            number,
            number,
            number
        ];
        u_density: any;
        u_distortion: any;
        u_strokeWidth: any;
        u_strokeTaper: any;
        u_strokeCap: any;
        u_noiseFrequency: any;
        u_noise: any;
        u_softness: any;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_dithering(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colorFront: [
            number,
            number,
            number,
            number
        ];
        u_shape: number;
        u_type: number;
        u_pxSize: any;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_pulsing_border(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colors: any;
        u_colorsCount: any;
        u_roundness: any;
        u_thickness: any;
        u_marginLeft: any;
        u_marginRight: any;
        u_marginTop: any;
        u_marginBottom: any;
        u_aspectRatio: number;
        u_softness: any;
        u_intensity: any;
        u_bloom: any;
        u_spots: any;
        u_spotSize: any;
        u_pulse: any;
        u_smoke: any;
        u_smokeSize: any;
        u_noiseTexture: HTMLImageElement | undefined;
        u_fit: number;
        u_rotation: any;
        u_scale: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_color_panels(input: Record<string, any>): {
    uniforms: {
        u_colors: any;
        u_colorsCount: any;
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_angle1: any;
        u_angle2: any;
        u_length: any;
        u_edges: any;
        u_blur: any;
        u_fadeIn: any;
        u_fadeOut: any;
        u_density: any;
        u_gradient: any;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_static_mesh_gradient(input: Record<string, any>): {
    uniforms: {
        u_colors: any;
        u_colorsCount: any;
        u_positions: any;
        u_waveX: any;
        u_waveXShift: any;
        u_waveY: any;
        u_waveYShift: any;
        u_mixing: any;
        u_grainMixer: any;
        u_grainOverlay: any;
        u_fit: number;
        u_rotation: any;
        u_scale: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_simplex_noise(input: Record<string, any>): {
    uniforms: {
        u_colors: any;
        u_colorsCount: any;
        u_stepsPerColor: any;
        u_softness: any;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
declare function make_perlin_noise(input: Record<string, any>): {
    uniforms: {
        u_colorBack: [
            number,
            number,
            number,
            number
        ];
        u_colorFront: [
            number,
            number,
            number,
            number
        ];
        u_proportion: any;
        u_softness: any;
        u_octaveCount: any;
        u_persistence: any;
        u_lacunarity: any;
        u_fit: number;
        u_scale: any;
        u_rotation: any;
        u_offsetX: any;
        u_offsetY: any;
        u_originX: any;
        u_originY: any;
        u_worldWidth: any;
        u_worldHeight: any;
    };
    fragmentShader: string;
    speed: any;
    frame: any;
};
export declare const shaderFactories: {
    "mesh-gradient": typeof make_mesh_gradient;
    "grain-gradient": typeof make_grain_gradient;
    "dot-grid": typeof make_dot_grid;
    "dot-orbit": typeof make_dot_orbit;
    warp: typeof make_warp;
    waves: typeof make_waves;
    water: typeof make_water;
    voronoi: typeof make_voronoi;
    swirl: typeof make_swirl;
    "smoke-ring": typeof make_smoke_ring;
    "static-radial-gradient": typeof make_static_radial_gradient;
    "neuro-noise": typeof make_neuro_noise;
    metaballs: typeof make_metaballs;
    "god-rays": typeof make_god_rays;
    spiral: typeof make_spiral;
    dithering: typeof make_dithering;
    "pulsing-border": typeof make_pulsing_border;
    "color-panels": typeof make_color_panels;
    "static-mesh-gradient": typeof make_static_mesh_gradient;
    "simplex-noise": typeof make_simplex_noise;
    "perlin-noise": typeof make_perlin_noise;
};
export declare const SHADER_BACKGROUND_VARIANTS: (keyof typeof shaderFactories)[];
export type ShaderBackgroundVariant = keyof typeof shaderFactories;
export {};
