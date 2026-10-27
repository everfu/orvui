<script setup lang="ts">
import { reactive, ref, useId } from "vue";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Switch } from "../switch";
import { CARD_TARGET_CLASS, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./index";
const instanceId = useId();
const documents = ref([
  { id: "agreement", title: "Signed contract", description: "The final PDF with every signature and the audit trail.", checked: true },
  { id: "billing", title: "Invoice", description: "Itemised billing for the period, ready for accounting.", checked: false },
]);
const preferences = reactive({ notifications: true, digest: false });
const rows = Object.entries({ Plan: "Team, yearly", Seats: "12", "Billing email": "billing@acme.co" });
</script>
<template>
  <div class="grid w-full max-w-3xl items-start gap-4 md:grid-cols-2">
    <div class="flex flex-col gap-3">
      <Card v-for="document in documents" :key="document.id" size="compact" interactive :selected="document.checked">
        <CardHeader><CardTitle>{{ document.title }}</CardTitle><CardDescription :id="`${instanceId}-${document.id}`">{{ document.description }}</CardDescription>
          <CardAction><Checkbox v-model="document.checked" :aria-label="document.title" :aria-describedby="`${instanceId}-${document.id}`" :class="CARD_TARGET_CLASS" /></CardAction>
        </CardHeader>
      </Card>
      <Card variant="muted" size="compact">
        <CardHeader><CardTitle as="h3">Notifications</CardTitle><CardDescription>Choose what reaches your inbox.</CardDescription></CardHeader>
        <CardContent class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-4"><span>Mentions and replies</span><Switch v-model="preferences.notifications" aria-label="Mentions and replies" /></div>
          <div class="flex items-center justify-between gap-4"><span>Weekly digest</span><Switch v-model="preferences.digest" aria-label="Weekly digest" /></div>
        </CardContent>
      </Card>
    </div>
    <div class="flex flex-col gap-4">
      <Card>
        <CardHeader><CardTitle as="h3">Review order</CardTitle><CardDescription>Check the details before you confirm.</CardDescription><CardAction><Button variant="ghost" size="sm">Edit</Button></CardAction></CardHeader>
        <CardContent><dl class="divide-y divide-border"><div v-for="[label, value] in rows" :key="label" class="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"><dt class="text-muted-foreground">{{ label }}</dt><dd class="font-medium text-foreground">{{ value }}</dd></div></dl></CardContent>
        <CardFooter class="justify-end"><Button variant="secondary" size="sm">Back</Button><Button size="sm">Confirm order</Button></CardFooter>
      </Card>
      <Card class="overflow-hidden pt-0">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80" alt="Bright open-plan studio with long desks and plants" :width="720" :height="405" loading="lazy" class="aspect-video w-full object-cover" />
        <CardHeader><CardTitle as="h3">Studio, Lisbon</CardTitle><CardDescription>Desks for 12 people, booked for the March offsite.</CardDescription></CardHeader>
        <CardFooter class="justify-between"><span class="text-sm text-muted-foreground"><span class="font-medium text-foreground">€1,840</span> · 3 days</span><Button variant="secondary" size="sm">View booking</Button></CardFooter>
      </Card>
    </div>
  </div>
</template>
