import { watch } from "vue";
import type { PageData } from "vitepress";
import { notFoundRobots } from "../shared-head";

/** Production VitePress omits global site heads from client route data. */
export function watchNotFoundHead(page: () => PageData) {
  return watch(
    page,
    (data) => {
      if (data.isNotFound)
        data.frontmatter = { ...data.frontmatter, head: [notFoundRobots] };
    },
    { immediate: true, flush: "sync" },
  );
}
