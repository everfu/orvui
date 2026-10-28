<script lang="ts">
import { defineComponent, h } from "vue";
import { useNewBadgeClock, type NewBadgeEntry } from "./new-badge";
export default defineComponent({
  name: "NewBadge",
  props: { launchedAt: String },
  setup(props) {
    const entry = (): NewBadgeEntry => ({
      badge: "new",
      launchedAt: props.launchedAt,
    });
    const clock = useNewBadgeClock(() => [entry()]);
    return () => {
      if (!clock.mounted.value) return null;
      return clock.isNew(entry())
        ? h("span", { class: "new-badge" }, "New")
        : null;
    };
  },
});
</script>
<style scoped>
.new-badge {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  border: 1px solid var(--border-strong);
  border-radius: 9999px;
  background: color-mix(in oklab, var(--accent) 10%, transparent);
  padding: 0.125rem 0.375rem;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1;
  color: var(--accent);
}
</style>
