import { defineNuxtRouteMiddleware, navigateTo } from "#imports";
import type { DocsPage } from "../../../../tools/docs/routes";

export default defineNuxtRouteMiddleware((route) => {
  const page = route.meta.orvuiPage as DocsPage | undefined;
  if (page && route.path !== page.path)
    return navigateTo(
      { path: page.path, query: route.query, hash: route.hash },
      { redirectCode: 301 },
    );
});
