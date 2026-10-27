export interface OrbFrame {
  activity: number;
  colors: readonly [string, string, string];
  speed: number;
  animated: boolean;
}

const vertexProgram = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// A spherical pigment field built from crossing waves and an analytic rim.
const fragmentProgram = `
precision highp float;
varying vec2 uv;
uniform vec2 resolution;
uniform float clock;
uniform float energy;
uniform vec3 pigment;
uniform vec3 highlight;
uniform vec3 shade;

float field(vec3 q) {
  float a = sin(q.x * 2.7 + sin(q.y * 2.1) + q.z);
  float b = cos(q.y * 3.2 - sin(q.z * 2.6) + q.x * .8);
  float c = sin(q.z * 4.1 + cos(q.x * 2.2) + q.y);
  return (a + b * .57 + c * .31) / 1.88;
}
void main() {
  vec2 p = uv * resolution / min(resolution.x, resolution.y);
  float angle = atan(p.y, p.x);
  float wave = sin(angle * 3.0 + clock * .8) * .55
             + cos(angle * 5.0 - clock * .65) * .3
             + sin(angle * 2.0 + clock * .4) * .15;
  float radius = .91 + .008 * sin(clock * 1.4) + energy * .025;
  radius += wave * (.004 + energy * .024);
  p /= radius;
  float squared = dot(p, p);
  float opacity = 1.0 - smoothstep(1.0 - 3.0 / min(resolution.x, resolution.y), 1.0, squared);
  if (opacity < .001) { gl_FragColor = vec4(0.0); return; }
  vec3 n = vec3(p, sqrt(max(0.0, 1.0 - squared)));
  float time = clock * .25;
  vec3 q = n * vec3(1.8, 1.6, 1.5) + vec3(time, -time * .7, time * .4);
  float flow = field(q);
  vec3 bent = q + vec3(field(q.yzx + 3.2), field(q.zxy - 2.8), flow) * (.45 + energy * .35);
  float folds = field(bent) * .38 + n.x * .48 + n.y * .3;
  vec3 ink = mix(shade, pigment, smoothstep(-.45, .35, folds));
  ink = mix(ink, highlight, smoothstep(.1, .8, flow) * .3);
  float lit = max(dot(n, normalize(vec3(-.4, .65, 1.0))), 0.0);
  ink *= .64 + .46 * lit;
  float seam = exp(-pow((folds + .04) * 8.0, 2.0)) * pow(n.z, .7);
  ink = mix(ink, mix(highlight, vec3(1.0), .55), seam * .75);
  ink = mix(ink, highlight, exp(-pow((folds - .28) * 4.0, 2.0)) * n.z * (.18 + energy * .16));
  ink += pow(lit, 24.0) * .16;
  ink = mix(ink, highlight, pow(1.0 - n.z, 3.0) * (.36 + .25 * max(-n.x, 0.0)));
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - .5;
  gl_FragColor = vec4(clamp(ink + grain * .032, 0.0, 1.0), opacity);
}`;

function parseColor(value: string): Float32Array {
  if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value))
    throw new Error("VoiceOrb colors must be #RGB or #RRGGBB hex colors.");
  const digits = value.slice(1);
  const pairs =
    digits.length === 3
      ? Array.from(digits, (digit) => digit + digit)
      : [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)];
  return Float32Array.from(pairs, (pair) => parseInt(pair, 16) / 255);
}

/** GPU lifetime and visibility scheduling are isolated from caller-owned audio. */
export function createOrbRenderer(
  canvas: HTMLCanvasElement,
  read: () => OrbFrame,
  onError: (error: Error) => void,
) {
  const context = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: "low-power",
  });
  if (!context) throw new Error("WebGL is unavailable in this browser.");
  const gpu = context;
  const resources: {
    program?: WebGLProgram;
    buffer?: WebGLBuffer;
    shaders: WebGLShader[];
  } = { shaders: [] };
  const locations = new Map<string, WebGLUniformLocation | null>();
  let disposed = false,
    unavailable = false,
    failed = false,
    inViewport = true;
  let scheduled: number | undefined,
    lastTime: number | undefined,
    elapsed = 0;
  let width = canvas.clientWidth || 256,
    height = canvas.clientHeight || 256;
  let colorKey = "";
  const release = () => {
    resources.shaders.splice(0).forEach((shader) => gpu.deleteShader(shader));
    if (resources.buffer) gpu.deleteBuffer(resources.buffer);
    if (resources.program) gpu.deleteProgram(resources.program);
    resources.buffer = undefined;
    resources.program = undefined;
    locations.clear();
  };
  const link = () => {
    const compile = (kind: number, text: string) => {
      const shader = gpu.createShader(kind);
      if (!shader) throw new Error("Could not allocate an orb shader.");
      resources.shaders.push(shader);
      gpu.shaderSource(shader, text);
      gpu.compileShader(shader);
      if (!gpu.getShaderParameter(shader, gpu.COMPILE_STATUS))
        throw new Error(
          gpu.getShaderInfoLog(shader) || "Could not compile the orb shader.",
        );
      return shader;
    };
    const vertex = compile(gpu.VERTEX_SHADER, vertexProgram);
    const fragment = compile(gpu.FRAGMENT_SHADER, fragmentProgram);
    const program = gpu.createProgram();
    if (!program) throw new Error("Could not allocate the orb program.");
    resources.program = program;
    for (const shader of [vertex, fragment]) gpu.attachShader(program, shader);
    gpu.linkProgram(program);
    if (!gpu.getProgramParameter(program, gpu.LINK_STATUS))
      throw new Error(
        gpu.getProgramInfoLog(program) || "Could not link the orb program.",
      );
    gpu.useProgram(program);
    const buffer = gpu.createBuffer();
    if (!buffer) throw new Error("Could not allocate the orb buffer.");
    resources.buffer = buffer;
    gpu.bindBuffer(gpu.ARRAY_BUFFER, buffer);
    gpu.bufferData(
      gpu.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gpu.STATIC_DRAW,
    );
    const position = gpu.getAttribLocation(program, "position");
    gpu.enableVertexAttribArray(position);
    gpu.vertexAttribPointer(position, 2, gpu.FLOAT, false, 0, 0);
    for (const name of [
      "resolution",
      "clock",
      "energy",
      "pigment",
      "highlight",
      "shade",
    ])
      locations.set(name, gpu.getUniformLocation(program, name));
    colorKey = "";
  };
  const halt = () => {
    if (scheduled !== undefined) cancelAnimationFrame(scheduled);
    scheduled = undefined;
    lastTime = undefined;
  };
  const canPaint = () =>
    !disposed && !failed && !unavailable && inViewport && !document.hidden;
  const report = (problem: unknown) => {
    failed = true;
    halt();
    onError(problem instanceof Error ? problem : new Error(String(problem)));
  };
  const paint = (now: number) => {
    scheduled = undefined;
    if (!canPaint()) {
      lastTime = undefined;
      return;
    }
    try {
      const state = read();
      const delta =
        lastTime === undefined
          ? 0
          : Math.min(50, Math.max(0, now - lastTime)) / 1000;
      if (state.animated)
        elapsed += delta * state.speed * (1 + state.activity * 0.6);
      lastTime = state.animated ? now : undefined;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const pixels = [
        Math.max(1, Math.round(width * ratio)),
        Math.max(1, Math.round(height * ratio)),
      ];
      if (canvas.width !== pixels[0]) canvas.width = pixels[0];
      if (canvas.height !== pixels[1]) canvas.height = pixels[1];
      gpu.viewport(0, 0, pixels[0], pixels[1]);
      gpu.uniform2f(locations.get("resolution") ?? null, pixels[0], pixels[1]);
      gpu.uniform1f(locations.get("clock") ?? null, elapsed);
      gpu.uniform1f(locations.get("energy") ?? null, state.activity);
      const nextColors = state.colors.join("|");
      if (colorKey !== nextColors) {
        const channels = state.colors.map(parseColor);
        ["pigment", "highlight", "shade"].forEach((name, index) =>
          gpu.uniform3fv(locations.get(name) ?? null, channels[index]),
        );
        colorKey = nextColors;
      }
      gpu.drawArrays(gpu.TRIANGLE_STRIP, 0, 4);
      if (state.animated) requestDraw();
    } catch (problem) {
      report(problem);
    }
  };
  function requestDraw() {
    if (canPaint() && scheduled === undefined)
      scheduled = requestAnimationFrame(paint);
  }
  const lost = (event: Event) => {
    event.preventDefault();
    unavailable = true;
    halt();
  };
  const restored = () => {
    if (disposed) return;
    try {
      release();
      link();
      unavailable = false;
      failed = false;
      requestDraw();
    } catch (problem) {
      report(problem);
    }
  };
  const visibility = () => {
    if (document.hidden) halt();
    else requestDraw();
  };
  try {
    link();
  } catch (problem) {
    release();
    throw problem;
  }
  const resize =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver((entries) => {
          const entry = entries[0];
          if (entry) {
            width = entry.contentRect.width || width;
            height = entry.contentRect.height || height;
          }
          requestDraw();
        });
  resize?.observe(canvas);
  const intersection =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver((entries) => {
          inViewport = entries[0]?.isIntersecting ?? true;
          if (inViewport) requestDraw();
          else halt();
        });
  intersection?.observe(canvas);
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  document.addEventListener("visibilitychange", visibility);
  requestDraw();
  return {
    requestDraw,
    dispose() {
      if (disposed) return;
      disposed = true;
      halt();
      resize?.disconnect();
      intersection?.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      document.removeEventListener("visibilitychange", visibility);
      release();
    },
  };
}
