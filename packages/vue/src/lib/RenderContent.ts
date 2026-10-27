import { defineComponent, h, isVNode } from "vue";

export default defineComponent({
  props: ["node"],
  setup(props) {
    return () => {
      const content = props.node;
      if (typeof content === "function") return h(content);
      if (content === null || typeof content !== "object" || Array.isArray(content) || isVNode(content)) return content;
      return h(content);
    };
  },
});
