# orvui documentation

Nuxt 4 SSR is the single documentation application. Run from the workspace root:

```sh
pnpm install
pnpm dev
```

Use Node.js 24 and the workspace-pinned pnpm 10.30.3.
Development uses Nuxt's default port selection, normally `http://localhost:3000`.
Use the address printed by Nuxt; no fixed-port check is applied.
The structure follows the [official Nuxt 4 starter](https://github.com/nuxt/starter/tree/v4),
with Nuxt pinned to 4.6.3 for reproducible workspace builds.

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm preview
HOST=127.0.0.1 PORT=5174 pnpm start
```

The route manifest derives from the component catalog and localized guide
content. The application uses Nuxt 4's `app/` structure:

- `app.vue` adapts Nuxt navigation and keeps one shared shell around `NuxtPage`.
- `pages/` validates routes and renders the current documentation content.
- `components/docs/` contains private site components and the shell; the shell
  owns navigation, sidebars, breadcrumbs and footer, with page content in its slot.
- `composables/` owns reusable reactive state, subscriptions and cleanup.
- `utils/docs/` contains pure helpers, localized content, metadata and icon provenance.
- `assets/` contains the CSS entry and `assets/css/` its private styles.
- `middleware/` normalizes addresses; `plugins/` enhances internal anchors.
- `error.vue` reuses the shell for localized error recovery.

There is one shared shell, so no extra Nuxt layout is needed. The site uses
explicit imports to keep components independently testable. Public library
components retain their own styles and implementation locations.

`tsconfig.json` references Nuxt's generated app, server, shared and Node projects.
`nuxt typecheck` prepares and checks them; shared compiler overrides belong in
`nuxt.config.ts`. The root TypeScript config covers library, tools and integration
tests instead of explicitly including the documentation app again.
The 242 routes, 109 components and 72 examples share generated API information,
registry items and downloadable Markdown. No content database is needed.

The default build produces a standalone Node server in `.output/`. Netlify uses
`NITRO_PRESET=netlify`, a base directory of `apps/docs`, the workspace build command
and `dist` plus generated SSR functions. Build configuration changes do not deploy.

Validate the Netlify artifact separately from the standalone Node build:

```sh
NITRO_PRESET=netlify pnpm build
pnpm verify:docs-netlify
```

This checks the generated SSR handler, localized routes, 404 responses and static
downloads. Keep deployment state in the ignored `.netlify/` directory. Pushing
code or deploying requires an explicit user request.

Use the preview address printed by Nuxt. Verification defaults to
`http://127.0.0.1:5174`; set `ORVUI_NUXT_URL` to the running server's address
when it differs. After starting the production server:

```sh
pnpm verify:docs-nuxt
pnpm verify:social
pnpm verify:docs-nuxt:standalone
pnpm docs:nuxt:browser:install
pnpm verify:docs-nuxt:browser
```

Use `ORVUI_NUXT_URL` to change the SSR and browser test target. Browser tests use local
fixtures for decorative external avatars. The standalone check copies only
`.output/` and denies filesystem access to the rest of the workspace.
Verification output, browser downloads and screenshots stay in `artifacts/`.
The `docs:nuxt:*` commands remain aliases for the default commands.
