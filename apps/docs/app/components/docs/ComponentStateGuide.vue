<script setup lang="ts">
import { computed } from "vue";
import metadata from "../../../../../tools/registry/component-docs.json";
import type { ComponentDocs } from "../../../../../tools/registry/component-docs-types";
import {
  componentBindings,
  componentStateCopy,
} from "../../utils/docs/component-handbook";
const props = defineProps<{ category: string; slug: string; en: boolean }>();
const bindings = computed(() =>
  componentBindings(
    (metadata as unknown as ComponentDocs).entries[
      `${props.category}/${props.slug}`
    ],
  ),
);
const t = (zh: string, en: string) => (props.en ? en : zh);
</script>
<template>
  <section id="state-and-events" class="details-section component-state-guide">
    <h2 class="guide-title">{{ t("状态与事件", "State and events") }}</h2>
    <p class="guide-copy">
      {{
        (bindings.length
          ? componentStateCopy.controlled
          : componentStateCopy.static)[en ? "en" : "zh"]
      }}
    </p>
    <div v-if="bindings.length" class="docs-reference-table">
      <table>
        <caption class="sr-only">
          {{
            t("组件状态绑定", "Component state bindings")
          }}
        </caption>
        <thead>
          <tr>
            <th>{{ t("组件", "Component") }}</th>
            <th>{{ t("Vue 绑定", "Vue binding") }}</th>
            <th>{{ t("更新事件", "Update event") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="binding in bindings"
            :key="binding.component + binding.prop"
          >
            <td>
              <code>{{ binding.component }}</code>
            </td>
            <td>
              <code>{{ binding.directive }}</code
              ><small>{{ binding.type }}</small>
            </td>
            <td>
              <code>{{ binding.event }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="bindings.length" class="guide-copy">
      {{ componentStateCopy.uncontrolled[en ? "en" : "zh"] }}
    </p>
  </section>
</template>
