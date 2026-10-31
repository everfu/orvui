<script setup lang="ts">
import { computed } from "vue";
import metadata from "../../data/component-docs.json";
import type {
  ApiComponent,
  ComponentDocs,
} from "../../utils/docs/component-docs-types";
const props = withDefaults(
  defineProps<{
    category: string;
    slug: string;
    variant?: string;
    en?: boolean;
    docs?: ApiComponent[];
  }>(),
  { en: false },
);
const registry = metadata as unknown as ComponentDocs;
type Row = {
  key: string;
  name: string;
  type: string;
  description?: string;
  annotation: string;
  scope?: string;
};
type Group = {
  kind: "prop" | "event" | "slot";
  heading?: string;
  caption: string;
  rows: Row[];
};
const localized = (zh: string, en: string) => (props.en ? en : zh);
const records = computed(() => {
  const item = registry.entries[`${props.category}/${props.slug}`];
  const components =
    props.docs ??
    (props.variant ? item?.variants[props.variant] : item?.default)
      ?.components ??
    [];
  return components.flatMap((component) => {
    const groups: Group[] = [
      {
        kind: "prop",
        caption: `${component.displayName} ${localized("属性", "props")}`,
        rows: component.props.map((prop) => ({
          key: prop.name,
          name: prop.name + (prop.required ? "" : "?"),
          type: prop.type ?? "—",
          description: prop.description,
          annotation: prop.defaultValue ?? "—",
        })),
      },
      {
        kind: "event",
        heading: localized("事件", "Events"),
        caption: `${component.displayName} ${localized("事件", "events")}`,
        rows: component.events.map((event) => ({
          key: event.name,
          name: event.name,
          type: event.signature ?? "—",
          description: event.description,
          annotation: "@" + event.name,
        })),
      },
      {
        kind: "slot",
        heading: localized("插槽", "Slots"),
        caption: `${component.displayName} ${localized("插槽", "slots")}`,
        rows: component.slots.map((slot) => ({
          key: slot.name,
          name: slot.name,
          type: slot.signature ?? "—",
          description: slot.description,
          annotation: "#" + slot.name,
          scope: slot.bindings.length
            ? localized("作用域参数", "Scope bindings") +
              ": " +
              slot.bindings.map((binding) => binding.name).join(", ")
            : undefined,
        })),
      },
    ];
    const visible = groups.filter((group) => group.rows.length);
    return visible.length
      ? [{ name: component.displayName, groups: visible }]
      : [];
  });
});
</script>
<template>
  <div v-if="records.length" class="props-reference">
    <div
      v-for="component in records"
      :key="component.name"
      class="api-component"
    >
      <h3 v-if="records.length > 1" class="api-component-title">
        {{ component.name }}
      </h3>
      <component
        :is="group.kind === 'prop' ? 'div' : 'section'"
        v-for="group in component.groups"
        :key="group.kind"
        :class="group.heading ? 'api-section' : undefined"
        ><h4 v-if="group.heading" class="api-section-title">
          {{ group.heading }}
        </h4>
        <div class="api-table" :aria-label="group.caption">
          <div
            v-for="row in group.rows"
            :key="row.key"
            class="api-row"
            :data-api-kind="group.kind"
          >
            <code class="api-code api-name">{{ row.name }}</code>
            <div class="api-type">
              <code class="api-code api-wrap">{{ row.type }}</code>
              <p v-if="row.description" class="api-description">
                {{ row.description }}
              </p>
              <p v-if="row.scope" class="api-description">{{ row.scope }}</p>
            </div>
            <code class="api-code api-default api-wrap">{{
              row.annotation
            }}</code>
          </div>
        </div></component
      >
    </div>
  </div>
</template>
<style scoped>
.props-reference {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.api-component-title {
  margin: 0 0 0.75rem;
  color: var(--foreground);
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
}
.api-table {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}
.api-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}
.api-row + .api-row {
  border-top: 1px solid var(--border);
}
.api-code {
  width: fit-content;
  height: fit-content;
  border-radius: 0.375rem;
  background: color-mix(in oklab, var(--foreground) 5%, transparent);
  padding: 0.125rem 0.5rem;
  color: var(--foreground);
  font-family: var(--font-geist-mono), monospace;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.5;
}
.api-type,
.api-default {
  min-width: 0;
}
.api-wrap {
  overflow-wrap: anywhere;
}
.api-description {
  margin: 0.375rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.api-section {
  margin-top: 1.25rem;
}
.api-section-title {
  margin: 0 0 0.75rem;
  color: var(--foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
}
@container (min-width: 640px) {
  .api-row {
    grid-template-columns: 140px minmax(160px, 0.75fr) minmax(240px, 2fr);
    gap: 1rem;
  }
  .api-default {
    justify-self: end;
  }
}
</style>
