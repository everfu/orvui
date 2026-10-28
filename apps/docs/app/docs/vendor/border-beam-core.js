/* MIT, Copyright (c) 2026 Jakub Antalik. See /licenses/border-beam-MIT.txt.
 * Unmodified md/colorful CSS generator and dependencies from border-beam@1.4.1.
 * https://registry.npmjs.org/border-beam/-/border-beam-1.4.1.tgz
 * dist/index.es.js SHA256: ef803b371359df8015187f5e387ba2cfc8504ed3d2ba5c68908a4e4b5a0c4670. React renderer excluded.
 */
const G = {colorful: {
    border: [
      { color: "rgb(255, 50, 100)", pos: "33% -7.4%", size: "70px 40px" },
      { color: "rgb(40, 140, 255)", pos: "12% -5%", size: "60px 35px" },
      { color: "rgb(50, 200, 80)", pos: "2.1% 68.3%", size: "40px 70px" },
      { color: "rgb(30, 185, 170)", pos: "2.1% 68.3%", size: "20px 35px" },
      { color: "rgb(100, 70, 255)", pos: "74.4% 100%", size: "180px 32px" },
      { color: "rgb(40, 140, 255)", pos: "55% 100%", size: "85px 26px" },
      { color: "rgb(255, 120, 40)", pos: "93.9% 0%", size: "74px 32px" },
      { color: "rgb(240, 50, 180)", pos: "100% 27.1%", size: "26px 42px" },
      { color: "rgb(180, 40, 240)", pos: "100% 27.1%", size: "52px 48px" }
    ],
    spike: { primary: "rgb(255, 60, 80)", secondary: "rgba(40, 190, 180, 0.98)" },
    spikeLt: { primary: "rgb(200, 30, 60)", secondary: "rgb(20, 150, 140)" }
  }};

function je(a) {
  return G[a].border.map((o) => `radial-gradient(ellipse ${o.size} at ${o.pos}, ${o.color}, transparent)`).join(`,
    `);
}

function Te(a) {
  const e = G[a], o = a === "mono" ? 0.225 : 0.45;
  return e.border.map((r) => {
    const t = r.color.replace("rgb(", "rgba(").replace(")", `, ${o})`);
    return `radial-gradient(ellipse ${r.size.split(" ").map((i) => {
      const c = parseInt(i);
      return `${Math.round(c * 0.9)}px`;
    }).join(" ")} at ${r.pos}, ${t}, transparent)`;
  }).join(`,
    `);
}

function N(a) {
  return `
[data-beam="${a}"][data-paused],
[data-beam="${a}"][data-paused]::after,
[data-beam="${a}"][data-paused]::before,
[data-beam="${a}"][data-paused] [data-beam-bloom] {
  animation-play-state: paused !important;
}`;
}

function R(a, e = 1) {
  return Math.max(0.5, Math.round(a * e * 100) / 100);
}

function bo(a) {
  const {
    id: e,
    borderRadius: o,
    borderWidth: r,
    duration: t,
    strokeOpacity: s,
    innerOpacity: i,
    bloomOpacity: c,
    innerShadow: p,
    colorVariant: b,
    staticColors: g,
    brightness: n,
    saturation: l,
    hueRange: f,
    theme: W,
    glowSize: y = 1
  } = a, d = Math.max(0, o - r), m = b === "mono" ? 0.5 : 1, H = s * m, X = i * m, O = c * m, $ = g ? "" : `animation: beam-hue-shift-${e} 12s ease-in-out infinite;`, Y = g ? "" : `
@keyframes beam-hue-shift-${e} {
  0% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) - ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
  50% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) + ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
  100% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) - ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
}`, x = W === "dark", w = x ? `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 54%,
        rgba(255, 255, 255, 0.1) 57%,
        rgba(255, 255, 255, 0.3) 60%,
        rgba(255, 255, 255, 0.6) 63%,
        rgba(255, 255, 255, 0.75) 66%,
        rgba(255, 255, 255, 0.6) 69%,
        rgba(255, 255, 255, 0.3) 72%,
        rgba(255, 255, 255, 0.1) 75%,
        transparent 78%, transparent 100%
      )` : `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 54%,
        rgba(0, 0, 0, 0.08) 57%,
        rgba(0, 0, 0, 0.2) 60%,
        rgba(0, 0, 0, 0.4) 63%,
        rgba(0, 0, 0, 0.55) 66%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.2) 72%,
        rgba(0, 0, 0, 0.08) 75%,
        transparent 78%, transparent 100%
      )`, v = je(b), u = Te(b), k = x ? `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 58%,
        rgba(255, 255, 255, 0.03) 62%,
        rgba(255, 255, 255, 0.08) 65%,
        rgba(255, 255, 255, 0.2) 67%,
        rgba(255, 255, 255, 0.45) 69%,
        rgba(255, 255, 255, 0.85) 70%,
        rgba(255, 255, 255, 0.85) 70.5%,
        rgba(255, 255, 255, 0.45) 71.5%,
        rgba(255, 255, 255, 0.2) 73%,
        rgba(255, 255, 255, 0.08) 75%,
        rgba(255, 255, 255, 0.03) 78%,
        transparent 82%
      )` : `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 58%,
        rgba(0, 0, 0, 0.02) 62%,
        rgba(0, 0, 0, 0.08) 65%,
        rgba(0, 0, 0, 0.2) 67%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.6) 70%,
        rgba(0, 0, 0, 0.6) 70.5%,
        rgba(0, 0, 0, 0.4) 71.5%,
        rgba(0, 0, 0, 0.2) 73%,
        rgba(0, 0, 0, 0.08) 75%,
        rgba(0, 0, 0, 0.02) 78%,
        transparent 82%
      )`;
  return `
@property --beam-angle-${e} {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}

@property --beam-opacity-${e} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-beam="${e}"] {
  position: relative;
  border-radius: ${o}px;
  overflow: hidden;
}

[data-beam="${e}"][data-active] {
  animation:
    beam-spin-${e} ${t}s linear infinite,
    beam-fade-in-${e} 0.6s ease forwards;
}

[data-beam="${e}"][data-fading] {
  animation:
    beam-spin-${e} ${t}s linear infinite,
    beam-fade-out-${e} 0.5s ease forwards;
}

[data-beam="${e}"][data-active]::after,
[data-beam="${e}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${d}px;
  padding: ${r}px;
  clip-path: inset(0 round ${o}px);
  background: ${w},${v};
  -webkit-mask:
    conic-gradient(
      from var(--beam-angle-${e}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    conic-gradient(
      from var(--beam-angle-${e}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--beam-opacity-${e}) * ${H.toFixed(2)} * var(--beam-stroke-opacity, 1) * var(--beam-strength, 1));
  ${$}
}

[data-beam="${e}"][data-active]::before,
[data-beam="${e}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${o}px;
  background: ${u};
  box-shadow: inset 0 0 9px 1px ${p};
  -webkit-mask-image:
    conic-gradient(
      from var(--beam-angle-${e}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-in, source-over;
  mask-image:
    conic-gradient(
      from var(--beam-angle-${e}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: intersect, add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--beam-opacity-${e}) * ${X.toFixed(2)} * var(--beam-inner-opacity, 1) * var(--beam-strength, 1));
  clip-path: inset(0 round ${o}px);
  ${$}
}

[data-beam="${e}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${d}px;
  clip-path: inset(0 round ${o}px);
  background: ${k};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: ${r}px;
  filter: blur(${R(8, y)}px) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)});
  pointer-events: none;
  z-index: 3;
  opacity: 0;
}

[data-beam="${e}"][data-active] [data-beam-bloom],
[data-beam="${e}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${e}) * ${O.toFixed(2)} * var(--beam-bloom-opacity, 1) * var(--beam-strength, 1));
}

@keyframes beam-spin-${e} {
  to { --beam-angle-${e}: 360deg; }
}

@keyframes beam-fade-in-${e} {
  to { --beam-opacity-${e}: 1; }
}

@keyframes beam-fade-out-${e} {
  from { --beam-opacity-${e}: 1; }
  to { --beam-opacity-${e}: 0; }
}
${Y}
${N(e)}
`;
}
export {bo as borderBeamCss};
