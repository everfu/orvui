<script lang="ts">
import { defineComponent, h, type PropType } from "vue";
import { cn } from "../../../lib/utils";
import { RenderNode } from "../../shared";
import type { NotificationStackItem } from "./NotificationStack.vue";
import type { NotificationStackClassNames } from "./source-types";
export default defineComponent({
  props: {
    item: { type: Object as PropType<NotificationStackItem>, required: true },
    classNames: Object as PropType<NotificationStackClassNames>,
  },
  setup(props) {
    return () => {
      const content = props.item,
        styles = props.classNames;
      const title = h(
        "span",
        {
          class: cn("min-w-0 text-sm font-medium leading-snug", styles?.title),
        },
        [h(RenderNode, { node: content.title })],
      );
      const trailing = content.trailing
        ? h("span", { class: cn("shrink-0 text-xs", styles?.trailing) }, [
            h(RenderNode, { node: content.trailing }),
          ])
        : null;
      const header = h(
        "span",
        { class: "flex min-w-0 items-start justify-between gap-3" },
        [title, trailing],
      );
      const description = content.description
        ? h(
            "span",
            {
              class: cn(
                "text-xs leading-relaxed text-muted-foreground",
                styles?.description,
              ),
            },
            [h(RenderNode, { node: content.description })],
          )
        : null;
      return h(
        "span",
        { class: cn("flex min-w-0 flex-col gap-1.5 py-4", styles?.content) },
        [header, description],
      );
    };
  },
});
</script>
