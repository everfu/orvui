import { nextTick } from "vue";
import { defineNuxtPlugin } from "#imports";
import type { DocsPage } from "../utils/docs/route-manifest";
import { DOCS_MOTION } from "../utils/docs/docs-motion";

export default defineNuxtPlugin((app) => {
  const router = app.$router;
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let destination: object | undefined;
  let pending = false;
  let disposed = false;
  let generation = 0;
  let native: ViewTransition | undefined;
  let animation: Animation | undefined;
  let busy: HTMLElement | null = null;
  const content = () => document.getElementById("docs-content");
  const release = () => {
    root.removeAttribute("data-docs-route-motion");
    if (busy) {
      busy.removeAttribute("aria-busy");
      busy.inert = false;
      busy = null;
    }
  };
  const cancel = () => {
    generation++;
    pending = false;
    native?.skipTransition();
    native = undefined;
    animation?.cancel();
    animation = undefined;
    release();
  };
  const setBusy = () => {
    const element = content();
    if (busy && busy !== element) {
      busy.removeAttribute("aria-busy");
      busy.inert = false;
    }
    busy = element;
    if (busy) {
      busy.setAttribute("aria-busy", "true");
      busy.inert = true;
    }
  };
  const before = router.beforeEach((to, from) => {
    cancel();
    destination = to;
    const next = to.meta.orvuiPage as DocsPage | undefined;
    const previous = from.meta.orvuiPage as DocsPage | undefined;
    pending =
      !app.isHydrating &&
      document.visibilityState !== "hidden" &&
      to.path !== from.path &&
      !!next &&
      !!previous &&
      next.frontmatter.layout !== "home" &&
      previous.frontmatter.layout !== "home";
  });
  const after = router.afterEach((_to, _from, failure) => {
    if (failure && _to === destination) cancel();
  });
  const error = router.onError(cancel);
  const start = app.hook("page:view-transition:start", (transition) => {
    if (!pending || disposed) {
      transition.skipTransition();
      return;
    }
    const token = generation;
    native = transition;
    root.setAttribute("data-docs-route-motion", "native");
    setBusy();
    void transition.finished
      .catch(() => {})
      .finally(() => {
        if (token !== generation) return;
        native = undefined;
        pending = false;
        release();
      });
  });
  const finish = app.hook("page:finish", async () => {
    if (!pending || disposed) return;
    const token = generation;
    await nextTick();
    if (!pending || disposed || token !== generation) return;
    setBusy();
    if (native) return;
    const element = content();
    if (!element || typeof element.animate !== "function") {
      pending = false;
      release();
      return;
    }
    // Run in the DOM flush before the next paint; the first SSR frame never enters here.
    animation = element.animate(
      [
        {
          opacity: 0.5,
          transform: media.matches
            ? "none"
            : `translateY(${DOCS_MOTION.distance}px)`,
        },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: media.matches ? DOCS_MOTION.reduced : DOCS_MOTION.enter,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    );
    void animation.finished
      .catch(() => {})
      .finally(() => {
        if (token !== generation) return;
        animation = undefined;
        pending = false;
        release();
      });
  });
  media.addEventListener("change", cancel);
  app.vueApp.onUnmount(() => {
    disposed = true;
    cancel();
    before();
    after();
    error();
    start();
    finish();
    media.removeEventListener("change", cancel);
  });
});
