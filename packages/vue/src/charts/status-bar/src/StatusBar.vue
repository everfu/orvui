<script setup lang="ts">
import { provide } from "vue";
import {
  createStatusBarModel,
  statusBarContext,
  type StatusBarProps,
} from "./context";
import StatusBarPlot from "./StatusBarPlot.vue";
import StatusBarLegend from "./StatusBarLegend.vue";
import StatusBarTooltip from "./StatusBarTooltip.vue";
const props = defineProps<StatusBarProps>();
const emit = defineEmits(["update:activeId", "activeChange"]);
const history = createStatusBarModel(props, emit);
provide(statusBarContext.key, history);
</script>

<template>
  <section
    :aria-label="history.label"
    :class="['relative min-w-0 w-full space-y-3', props.className]"
  >
    <slot><StatusBarPlot /><StatusBarLegend /><StatusBarTooltip /></slot>
    <div class="sr-only">
      <table>
        <caption>
          {{
            history.label
          }}
          data
        </caption>
        <thead>
          <tr>
            <th>Period</th>
            <th>Status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ datum, status } in history.rows" :key="datum.id">
            <th>{{ datum.label }}</th>
            <td>{{ status.label }}</td>
            <td>{{ datum.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
