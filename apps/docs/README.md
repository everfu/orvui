# orvui documentation

Nuxt 4 SSR is the single documentation application. Run from the workspace root:

```sh
pnpm install
pnpm dev
```

Development uses exactly `http://127.0.0.1:5174` and fails if the port is occupied.

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm preview
HOST=127.0.0.1 PORT=5174 pnpm start
```

The route manifest derives from the component catalog and localized guide
content. The application lives in `app/`; documentation components, content and
private styles live in `app/docs/`. Public components retain their own styles.
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

After starting the production server:

```sh
pnpm verify:docs-nuxt
pnpm verify:social
pnpm verify:docs-nuxt:standalone
pnpm docs:nuxt:browser:install
pnpm verify:docs-nuxt:browser
```

Use `ORVUI_NUXT_URL` to change the browser test target. Browser tests use local
fixtures for decorative external avatars. The standalone check copies only
`.output/` and denies filesystem access to the rest of the workspace.
Verification output, browser downloads and screenshots stay in `artifacts/`.
The `docs:nuxt:*` commands remain aliases for the default commands.
