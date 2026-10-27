# orvui development

orvui is a Vue 3.5 component library. The active contract is in `design.md`; the product catalog and public API compatibility baseline live in `tools/catalog/`.

- Preserve the existing geometry, motion, 11 palette values and semantic CSS override behavior. Generate CSS with `pnpm theme:build`.
- Implement internals independently against the frozen public behavior contract. Preserve actual implementation provenance and applicable copyright and license notices with the code and assets that use them.
- Components live in `packages/vue/src/{motion,blocks,agents,charts}/<slug>/`. Keep `index.ts` as the public barrel, implementations and types in `src/`, existing standalone CSS in `styles/`, the primary `demo.vue` at the component root, and registered variant demos in `examples/`. Put demo-only helpers in `examples/internal/` so they are not discovered as variants. Do not create empty directories or extract existing SFC styles merely to fill a folder.
- Keep single-component tests beside the component in `tests/`; cross-component, documentation, distribution and SSR/hydration integration tests and frozen fixtures stay in the root `tests/`. Exclude colocated tests from package files, declarations, registry payloads, source panels and Tailwind scanning. Preserve the frozen contract fixtures when moving implementation files.
- Public APIs use Composition API, `modelValue`/`update:modelValue`, `open`/`update:open`, slots and provide/inject. Optional controlled Boolean props default explicitly to `undefined`.
- Motion uses `whilePress`; normalize refs with `resolveElement`, use CSS units, per-instance IDs, shared springs and the overlay stack, and release all resources on unmount. Support reduced motion and SSR/hydration.
- Package exports and the copy-source registry use the same source. Follow all relative dependencies and preserve real third-party notices, including the separate Paper Design shader license and font OFL.
- Run `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm exec tsx tools/registry/build.ts --strict`. Declaration emission, browser behavior, visual acceptance, SSR, hydration and real package/registry consumption are separate checks.
- Builds and tests must be self-contained within this project. Generated coverage reports belong in `artifacts/reports/`; local package archives belong in `artifacts/packages/<version>/`.
- Web only. Nuxt module support remains deferred. No npm publication, push or deployment is authorized by local commands.
