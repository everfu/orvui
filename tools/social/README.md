# Social share image

`card.html` is the editable 1200 × 630 source for
`apps/docs/public/social/orvui-v2.png`. It uses the selected OV identity from
`assets/brand/` (the same source used by the site header and footer),
dark background (`#151515`), primary blue (`#0285f7`) and local Geist fonts.
The font assets and their OFL notices remain in `apps/docs/public/fonts/source/`.

Run `pnpm brand:sync` after changing the canonical SVG files to synchronize the
public SVG assets, favicon and shared Chinese/English README image. This also
runs during full workspace builds; development starts Nuxt directly.

To export, open the HTML in Chromium with a 1200 × 630 viewport at device scale 1,
wait for `document.fonts.ready`, and take a viewport PNG screenshot with animations
disabled. This requires no remote assets. The checked-in PNG is served as-is;
normal builds and tests do not need a browser or an image-generation service.

For visual revisions, increment the PNG filename and update `socialImage.path`
in `apps/docs/app/utils/docs/page-metadata.ts` together, so share caches can pick up the
new image. Keep essential content inside the existing 72px horizontal margins.

Social metadata and image contract assertions are covered by the existing tests
in `pnpm test`. Visual revisions still require manual inspection of the exported image.
