# orvui

A Vue 3.5 component library with motion controls, composed interfaces, assistant UI and charts. The Web catalog contains 109 components and 72 registered examples. Documentation is Chinese by default and includes English routes.

Public APIs, installation names, interaction behavior and all eleven color palettes are maintained as project contracts. Applicable copyright notices and third-party licenses remain with the components and assets that use them.

## Local development

Use the pnpm version specified in `package.json`.

```sh
pnpm install
pnpm dev
```

The development script serves the documentation at `http://127.0.0.1:5173`. Confirm the actual port printed by the server before browser checks. The documentation's installation guide lives at `/docs/installation` and `/en/docs/installation`.

## Component organization

The workspace separates `packages/vue` (library), `apps/docs` (documentation) and `tools` (catalog, generation and verification). Within `packages/vue/src/{motion,blocks,agents,charts}/<slug>/`, `index.ts` is the stable public entry, `src/` contains implementation and types, and `styles/` contains existing standalone CSS when needed. The primary `demo.vue` and registered `examples/*.vue` remain alongside the entry. Single-component tests live in `tests/` beside their implementation; integration suites and frozen fixtures remain in the root `tests/`.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for component, test and distribution conventions.

## Build and checks

```sh
pnpm metadata:docs
pnpm typecheck
pnpm api:check
pnpm test
pnpm build
pnpm exec tsx tools/registry/build.ts --strict
```

`pnpm build` regenerates metadata, emits the library and declarations, then builds the documentation and downloadable resources. `pnpm theme:build` generates CSS from the canonical palette contract; `pnpm theme:check` verifies that output.

Public export compatibility, component member contracts and the type-only consumer fixture are separate checks. Tests also cover server rendering, hydration and representative interactions. Generated file presence and passing tests do not establish visual acceptance.

## Install the component package

After npm publication:

```sh
pnpm add @orvui/vue
# or: npm install @orvui/vue
```

For local installation, pack from the repository root. The package's `prepack` step builds the library, declarations, themes and registry automatically:

```sh
pnpm --filter @orvui/vue pack --pack-destination "$PWD/artifacts/packages/0.1.0"
pnpm add ./artifacts/packages/0.1.0/orvui-vue-0.1.0.tgz
```

`pnpm package:build` runs the package build without creating an archive. Local archives live under `artifacts/packages/<version>/`, which is ignored by Git. Run the consumer checks below against the resulting archive before using it in another project.

Import from the package root or a documented component entry:

```vue
<script setup lang="ts">
import { Button } from '@orvui/vue/motion/button'
import '@orvui/vue/style.css'
</script>

<template><Button>Continue</Button></template>
```

Use `modelValue` / `update:modelValue` and `open` / `update:open` for controlled values. Omitting an optional controlled Boolean leaves it undefined. Slots and composables are part of the public interface.

## Install source with the CLI

The same Vue source backs package exports and the shadcn-vue registry served at https://orvui.efu.me/r/registry.json. Follow the installation guide for a full setup and import the installed `src/components/orvui/styles.css` once.

```sh
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

Registry items contain their relative helpers, CSS dependencies and applicable license files. The CLI installs these files at their declared targets. Usage examples import from public component barrels.

## Consumer verification

After packing, run the local package and source-consumption checks:

```sh
node tools/verify-distribution.mjs
node tools/verify-public-usage.mjs
node tools/verify-registry-usage.mjs
node tools/verify-component-install.mjs
```

These create isolated temporary projects. Evidence is written outside this repository, under the temporary `orvui-verification` directory by default. Set `ORVUI_VERIFICATION_DIR` to choose an output directory. `--archive /absolute/path.tgz`, `ORVUI_PACKAGE_ARCHIVE` or `ORVUI_USAGE_PACKAGE` selects an existing archive for any consumer check; otherwise the current version under `artifacts/packages/` is used. Existing `IUI_` environment aliases remain supported. Both registry checks serve local JSON and exercise the actual CLI.

Registry and API coverage reports are generated under `artifacts/reports/`; they are not source files. The verification helpers live in `tools/verification/`. To run their focused checks, use `node --test tools/verification/metadata.test.mjs`.

To also test updating an existing source installation, set `ORVUI_PREVIOUS_REGISTRY_DIRECTORY` to a local registry snapshot when running `node tools/verify-component-install.mjs`. This installs the old Button with the real CLI, updates it to the current source layout, and checks types, builds and retention of consumer files in an isolated temporary project.

## Project contracts

- `tools/catalog/components.json`: schema version 2 catalog, routes, component barrels and registered examples.
- `tools/catalog/public-api.json`: frozen package and component export names and kinds.
- `tools/catalog/component-contract.json`: frozen public component props, events, slots and controlled Boolean defaults.
- `packages/vue/src/theme/palettes.ts`: canonical values for all eleven palettes and their semantic override relationships.
- `design.md`: visual, behavior and compatibility requirements.

Builds and tests use only this project. Web is the active platform; Nuxt module support remains deferred.

## Licenses

Copyright (c) 2026 everfu. orvui is distributed under MIT; see [LICENSE](./LICENSE) and [NOTICE](./NOTICE). Paper Design shaders, fonts, icons and other dependencies retain their own licenses. Local build commands do not publish, push or deploy the project. The private GitHub repository is https://github.com/everfu/orvui; Netlify builds the documentation and source registry for https://orvui.efu.me.

## Hosting

Netlify uses the root `netlify.toml`, runs `pnpm build`, and serves `apps/docs/.vitepress/dist`. The registry remains public over HTTPS so shadcn-vue can install source while the GitHub repository remains private.
