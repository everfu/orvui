# orvui documentation

Nuxt 4 SSR is the single documentation application. Run from the workspace root:

```sh
pnpm install
pnpm docs:dev
```

Development starts Nuxt directly without generating resources. Run
`pnpm docs:resources` after adding components or changing APIs, demo imports,
branding, themes or other generated resource inputs. The generated files are
checked in, so a normal checkout can start without regenerating them.

Use Node.js 24 and the workspace-pinned pnpm 10.30.3.
Development uses Nuxt's default port selection, normally `http://localhost:3000`.
Use the address printed by Nuxt; no fixed-port check is applied.
The structure follows the [official Nuxt 4 starter](https://github.com/nuxt/starter/tree/v4),
with Nuxt pinned to 4.6.3 for reproducible workspace builds.

```sh
pnpm docs:typecheck
pnpm docs:build
pnpm docs:preview
HOST=127.0.0.1 PORT=3000 node apps/docs/.output/server/index.mjs
```

The route manifest derives from the component catalog and localized guide
content. The application uses Nuxt 4's `app/` structure:

- `app.vue` adapts Nuxt navigation and keeps one shared shell around `NuxtPage`.
- `pages/` validates routes and renders the current documentation content.
- `components/docs/` contains private site components and the shell; the shell
  owns navigation, sidebars and footer, with page content in its slot.
- `composables/` owns reusable reactive state, subscriptions and cleanup.
- `utils/docs/` contains pure helpers, localized content, metadata and icon provenance.
- `data/` contains generated component API and usage metadata consumed by the app.
- `assets/` contains the CSS entry and `assets/css/` its private styles.
- `middleware/` normalizes addresses; `plugins/` enhances internal anchors.
- `error.vue` reuses the shell for localized error recovery.

There is one shared shell, so no extra Nuxt layout is needed. The site uses
explicit imports to keep components independently testable. Public library
components retain their own styles and implementation locations.

Build-time generators live in `scripts/`; they write the app's generated data and
public downloads. `playwright.config.ts` uses the shared browser tests in the
workspace's `tests/e2e/` directory. Generated data, build scripts and browser
configuration are excluded from Tailwind scanning.

`tsconfig.json` references Nuxt's generated app, server, shared and Node projects.
`nuxt typecheck` prepares and checks them; shared compiler overrides belong in
`nuxt.config.ts`. The root TypeScript config covers the library, shared tools,
docs build scripts, browser configuration and integration tests. Nuxt checks the
documentation app.
Routes, components and examples share generated API information,
registry items and downloadable Markdown. No content database is needed.

The default build produces a standalone Node server in `.output/`. Netlify uses
`NITRO_PRESET=netlify`, a base directory of `apps/docs`, the workspace build command
and `dist` plus generated SSR functions. Build configuration changes do not deploy.

Build the Netlify artifact separately from the standalone Node build:

```sh
NITRO_PRESET=netlify pnpm build
```

Keep deployment state in the ignored `.netlify/` directory. Pushing code or
deploying requires an explicit user request.

The `docs:*` lifecycle commands call Nuxt directly.
`pnpm docs:resources` runs the generators in `scripts/` from the workspace root.
API and usage metadata go to `app/data/`; Markdown, the template manifest, raw
source links, RSS and the LLM index go to `public/`.
`pnpm build` generates those resources once and builds the library, declarations and
documentation. `pnpm check` runs that build, type checks and existing Vitest tests.
Standalone runtime, Netlify deployment and browser visual acceptance remain
separate from these basic checks.

Browser tests use the shared Playwright configuration:

```sh
PLAYWRIGHT_BROWSERS_PATH=artifacts/browsers pnpm exec playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=artifacts/browsers ORVUI_NUXT_URL=http://localhost:3000 pnpm exec playwright test --config apps/docs/playwright.config.ts
```

Set `ORVUI_NUXT_URL` to the actual running server address. Browser tests use local
fixtures for decorative external avatars. Reports, browser downloads and
screenshots stay in `artifacts/`. See [tools/README.md](../../tools/README.md) for
the generation tools and remaining commands.
