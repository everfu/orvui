import {
  channelFromPath,
  versionHref,
} from "../../../../tools/release-channels";
import { clearError, defineNuxtPlugin } from "#imports";

/** Shared docs use ordinary anchors; enhance only registered documentation URLs. */
export default defineNuxtPlugin((app) => {
  const router = app.$router;
  const click = (event: MouseEvent) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    )
      return;
    const anchor =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[href]")
        : null;
    if (
      !anchor ||
      anchor.hasAttribute("download") ||
      (anchor.target && anchor.target !== "_self")
    )
      return;
    const target = new URL(anchor.href, location.href);
    if (!anchor.closest(".version-panel"))
      target.pathname = versionHref(
        target.pathname,
        channelFromPath(location.pathname),
      );
    if (
      target.origin !== location.origin ||
      !router.resolve(target.pathname).meta.orvuiPage
    )
      return;
    event.preventDefault();
    const href = target.pathname + target.search + target.hash;
    if (app.payload.error)
      void app.runWithContext(() => clearError({ redirect: href }));
    else void router.push(href);
  };
  document.addEventListener("click", click);
  app.vueApp.onUnmount(() => document.removeEventListener("click", click));
});
