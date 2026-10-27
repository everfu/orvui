<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "./index";
const details = "Open this section whenever you need a little more information.";
</script>
<template>
  <Collapsible class="max-w-sm rounded-xl border border-border bg-background p-1">
    <CollapsibleTrigger>More details<CollapsibleIndicator /></CollapsibleTrigger>
    <CollapsibleContent content-class-name="px-3 pb-3 pt-1 text-sm leading-6 text-muted-foreground"><p>{{ details }}</p></CollapsibleContent>
  </Collapsible>
</template>
