<script setup lang="ts">
import { provide } from "vue";
import {
  createVolumeModel,
  volumeContext,
  type VolumeProfileProps,
} from "./context";
import VolumeProfilePlot from "./VolumeProfilePlot.vue";
import VolumeProfileSummary from "./VolumeProfileSummary.vue";
import VolumeProfileTooltip from "./VolumeProfileTooltip.vue";
const props = withDefaults(defineProps<VolumeProfileProps>(), {
  valueArea: undefined,
});
const emit = defineEmits(["update:activeId", "activeChange"]);
const profile = createVolumeModel(props, emit);
provide(volumeContext.key, profile);
</script>
<template>
  <section
    :aria-label="profile.label"
    :class="['relative w-full space-y-5', props.className]"
  >
    <slot
      ><VolumeProfilePlot /><VolumeProfileSummary /><VolumeProfileTooltip
    /></slot>
    <div class="sr-only">
      <table>
        <caption>
          {{
            profile.label
          }}
          data
        </caption>
        <thead>
          <tr>
            <th>Price range</th>
            <th>Volume</th>
            <th>Share</th>
            <th>Point of control</th>
            <th>Value area</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in profile.rows" :key="row.id">
            <th>
              {{ profile.formatPrice(row.priceLow) }} to
              {{ profile.formatPrice(row.priceHigh) }}
            </th>
            <td>{{ profile.formatVolume(row.volume) }}</td>
            <td>{{ (row.share * 100).toFixed(1) }}%</td>
            <td>{{ row.isPoc ? "Yes" : "No" }}</td>
            <td>{{ row.inValueArea ? "Yes" : "No" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
