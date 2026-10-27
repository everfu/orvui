import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import { watchNotFoundHead } from "./not-found-head";
import "../../../../packages/vue/src/styles.css";
import "./style.css";
import "./docs-layout.css";
import "./site-controls.css";
export default {
  Layout,
  enhanceApp({ app, router }) {
    const stop = watchNotFoundHead(() => router.route.data);
    app.onUnmount(stop);
  },
} satisfies Theme;
