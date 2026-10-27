# orvui — selected identity, concept 01

The user selected the first image-generated concept on 2026-10-27: a fluid OV
monogram paired with a rounded lowercase `orvui` wordmark.

| Asset | Purpose |
| --- | --- |
| [logo-mark.svg](logo-mark.svg) | Standalone symbol, square canvas, `currentColor` |
| [logo-horizontal.svg](logo-horizontal.svg) | Symbol and original outlined wordmark, `currentColor` |
| [logo-mark-white.svg](logo-mark-white.svg) | White standalone symbol on a transparent canvas |
| [logo-horizontal-white.svg](logo-horizontal-white.svg) | White horizontal logo on a transparent canvas |
| [favicon.svg](favicon.svg) | White symbol inside a dark rounded tile |
| [reference-concept-01.png](reference-concept-01.png) | Unmodified approved image-generation preview |

Every SVG is standalone with an explicit viewBox, an accessible title, and vector
paths only. No embedded bitmap or external font is required. `currentColor`
defaults to black; when using SVG through an `<img>`, use the white asset on dark
surfaces. Inline SVG or an external `<use>` can inherit CSS color.

## Provenance and fidelity

The approved source preview was created with the built-in OpenAI `image_gen`
tool in this chat. It is retained unmodified as `reference-concept-01.png`.
The contours of its main symbol and all five letters, including the `i` dot,
were reconstructed as cubic Bézier paths. The wordmark is traced from the
approved image, rather than substituted with an installed font. These files
do not contain Geist font outlines from the earlier rejected studies.

The reconstructed monochrome silhouette overlaps the thresholded source by
99.43% intersection-over-union at the original image resolution. This measures
contour fidelity.

## Preview and adoption

From the repository root:

```sh
node assets/logo-exploration/serve.mjs
```

Open <http://127.0.0.1:5196/assets/logo-exploration/> to see the selected logo in
black and white, its 56px navigation placement, favicon sizes, downloads, and
the original reference image.

The selected identity is applied to the documentation header and footer, the
Chinese/English README image, browser favicon, and v2 social card. Header and
footer share `SiteLogo.vue`, which imports the canonical horizontal SVG inline
and inherits the site's semantic foreground color in every theme.

`pnpm brand:sync` copies these source SVGs to the public brand directory and
updates the shared README tile and documentation favicon. It runs before the
root dev server and documentation metadata/build pipeline. Social PNG export
remains an explicit browser-rendering step documented in `tools/social/README.md`.
