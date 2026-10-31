# orvui product contracts

`components.json` schema version 2 is the maintained Web catalog. Its Vue barrels and example entries define navigation, search, documentation, installation names and copy-source registry items. Generated resources use `product.name` and `product.version`.

`public-api.json` freezes the public Vue exports for the package root and component modules. The public API baseline tests in `pnpm test` check missing names and runtime/type changes; they do not establish prop, slot or event compatibility. Behavior and consumer type fixtures check those separately. Ordinary builds never rewrite this baseline.

The source registry follows every relative TypeScript, Vue and CSS dependency. CSS installation targets retain real `.css` names and portable `.css.txt` registry transport paths. Package imports and CLI installation use the same actual source.

`component-contract.json` freezes component props, events, slots and controlled Boolean defaults. `media-provenance.json` records actual third-party media sources. Builds and tests use only this project; generated coverage reports are written to `artifacts/reports/`.

Component barrel and demo paths remain stable when internals move into the component's `src/` and `styles/`. Keep single-component tests in `tests/` beside their implementation; they are excluded from declarations, source registry closures and documentation source panels. Internal source paths in generated API metadata may change, but frozen export/member baselines and declaration fixtures must not be regenerated for a directory migration. See the root `CONTRIBUTING.md` for the full layout.
