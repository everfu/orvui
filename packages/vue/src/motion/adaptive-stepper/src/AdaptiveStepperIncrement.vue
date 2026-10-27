<script setup lang="ts">
import StepperAction from "./StepperAction.vue";
</script>
<template><StepperAction :direction="1"><template v-if="$slots.default" #default><slot /></template></StepperAction></template>
