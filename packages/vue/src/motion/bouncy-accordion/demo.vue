<script setup lang="ts">
import { h } from "vue";
import { CalendarClock, FileText, FolderKanban, PackageCheck, RadioTower, ShieldCheck } from "lucide-vue-next";
import { BouncyAccordion } from "./index";
const records = [
  ["brief", "Release Brief", "Gather launch notes, accountable owners and known risks into a brief handoff before the release.", FileText],
  ["launch", "Launch Checklist", "Review copy, links, analytics, recovery steps and approvals together before the launch starts.", ShieldCheck],
  ["campaign", "Campaign Notes", "Attach notes for each channel while keeping the closed task list compact and easy to scan.", RadioTower],
  ["calendar", "Rollout Calendar", "Coordinate announcements, staging reviews, reminders and quiet hours on a shared timeline.", CalendarClock],
  ["ship", "Ship Build", "Follow the build artifact, deployment state and final review before completing the release.", PackageCheck],
  ["archive", "Archive Assets", "File the approved copy, graphics and source in the campaign folder after the rollout ends.", FolderKanban],
] as const;
const items = records.map(([id, title, description, icon]) => ({ id, title, description, icon: h(icon, { class: "h-4 w-4" }) }));
</script>
<template><div class="flex min-h-96 w-full items-center justify-center"><div class="w-full max-w-sm h-[480px]"><BouncyAccordion :items="items" default-value="calendar" /></div></div></template>
