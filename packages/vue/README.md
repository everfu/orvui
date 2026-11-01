# orvui

Animated Vue 3.5 components with composable APIs, charts and copyable source.

## Package installation

```sh
pnpm add @orvui/vue
```

```vue
<script setup lang="ts">
import { Button } from '@orvui/vue/motion/button'
import '@orvui/vue/style.css'
</script>

<template>
  <Button>Continue</Button>
</template>
```

Import the stylesheet once in your application entrypoint. Components are also
available from `@orvui/vue`, category exports, and component subpaths. Vue 3.5
or later within the 3.x line is required. Package installation does not require
Tailwind in your application.

## Copy source with shadcn-vue

Use an existing Vue project with Tailwind CSS 4 and a configured `components.json`:

```sh
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

The CLI installs dependencies and copies the component, its shared resources
and theme into `src/components/orvui/`. Import copied components from that
directory and import `src/components/orvui/styles.css` once. The registry
JSON snapshots included in this package are generated from the same source as
the public registry. The public registry follows the documentation site's
current release; the package's `registry/` directory is the versioned snapshot.

Documentation: [orvui.efu.me](https://orvui.efu.me).

## License

Copyright (c) 2026 everfu. Licensed under MIT.

Read `LICENSE` and `NOTICE` before redistributing source. Existing copyright
attributions and third-party licenses remain applicable. In particular, the
Paper Design shader implementation retains its separate PolyForm Shield
license; the package's MIT license does not replace third-party terms.

## Vue 3.6 Beta

The local `0.2.0-beta.1` development release uses Vue `3.6.0-rc.14`, retaining virtual DOM rendering and the existing APIs. Switch between stable and `/beta/` docs in the header.

Run `pnpm beta:pack` to create `artifacts/packages/0.2.0-beta.1/orvui-vue-0.2.0-beta.1.tgz`. Copy it into a consumer project and run `pnpm add ./orvui-vue-0.2.0-beta.1.tgz`. This Beta is not published to npm. Vapor compilation is not enabled.
