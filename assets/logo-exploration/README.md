# orvui Logo exploration

The default preview now shows the approved image-generated **concept 01**. Its
final standalone assets and provenance live in [../brand/](../brand/README.md).

The earlier rejected Round 02 studies below are retained for history. Their
original preview is available at [round-02.html](round-02.html). They are not the
selected logo. The approved identity is now applied throughout the project;
see the brand README for the active consumers and synchronization command.

From the repository root, start the included dependency-free local server:

```sh
node assets/logo-exploration/serve.mjs
```

Open <http://127.0.0.1:5196/assets/logo-exploration/>. An optional numeric argument
selects another port. The server binds to loopback and serves only the preview and
its required shared assets, not the entire repository.

Alternatively, serve the **repository root** with a local static server and open
`/assets/logo-exploration/`. The preview uses the project's existing local
Geist fonts and baseline logo. No installation or build step is required.
JavaScript modules and external SVG `<use>` references require HTTP rather than
opening `index.html` directly with `file://`.

| Direction | Icon | Outlined wordmark |
| --- | --- | --- |
| A · 软结 | [SVG](a-soft-knot.svg) | [SVG](a-soft-knot-wordmark.svg) |
| B · 小泡 | [SVG](b-bubble.svg) | [SVG](b-bubble-wordmark.svg) |
| C · 折耳 | [SVG](c-soft-v.svg) | [SVG](c-soft-v-wordmark.svg) |
| D · 弹弹 | [SVG](d-spring.svg) | [SVG](d-spring-wordmark.svg) |
| E · 花簇 | [SVG](e-bloom.svg) | [SVG](e-bloom-wordmark.svg) |
| F · 软软字 | [SVG](f-handwritten.svg) | [SVG](f-handwritten-wordmark.svg) |

Each SVG is standalone, transparent, and uses `currentColor` (black by default).
Wordmarks contain outlined glyphs and require no font installation. The preview
references these exact files; it does not maintain separate copies of the shapes.

## Provenance

The six icon geometries were independently authored for this exploration. The
wordmark outlines in A–E use the project's local Geist 600 font. F uses custom
rounded paths, independently drawn with Geist proportions as a reference. Font copyright and licensing metadata are
retained inside each wordmark SVG. The full license is retained alongside them in
[LICENSE.geist-OFL.txt](LICENSE.geist-OFL.txt).

Geist: Copyright 2024 The Geist Project Authors
(https://github.com/vercel/geist-font), SIL Open Font License 1.1.

The preview is a review surface; downloads have no additional side effects.
The approved concept is applied separately through the shared brand assets.
