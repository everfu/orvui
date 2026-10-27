<script setup lang="ts">
import { DateRangePicker } from "../index";
const reporting = {
  label: "Reporting period",
  defaultMonth: "2026-10-01",
  defaultValue: { from: "2026-10-19", to: "2026-10-25" },
};
</script>
<template><DateRangePicker v-bind="reporting" /></template>
