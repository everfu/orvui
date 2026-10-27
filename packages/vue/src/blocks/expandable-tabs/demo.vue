<script setup lang="ts">
import { h, type Component } from "vue";
import {
  BadgeCheck,
  Brush,
  CalendarClock,
  ChartSpline,
  ChevronRight,
  ClipboardCheck,
  CloudUpload,
  FileText,
  Gauge,
  GitBranch,
  Images,
  Inbox,
  Megaphone,
  MessageCircle,
  PackageOpen,
  RefreshCw,
  Rocket,
  Siren,
  SwatchBook,
  UploadCloud,
  Users,
  Webhook,
  Workflow,
} from "lucide-vue-next";
import { ExpandableTabs, type ExpandableTabsItem } from "./index";
type MenuRow = readonly [Component, string];
function content(rows: readonly MenuRow[]) {
  return () =>
    h(
      "div",
      { class: "flex w-[17.125rem] flex-col gap-0.5" },
      rows.map(([icon, label]) =>
        h(
          "button",
          {
            key: label,
            type: "button",
            class:
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted",
          },
          [
            h(icon, { class: "h-4 w-4 text-muted-foreground" }),
            h("span", { class: "flex-1" }, label),
            h(ChevronRight, { class: "h-4 w-4 text-muted-foreground" }),
          ],
        ),
      ),
    );
}
const sections: readonly {
  id: string;
  label: string;
  icon: Component;
  rows: readonly MenuRow[];
}[] = [
  {
    id: "launch",
    label: "Launch",
    icon: Rocket,
    rows: [
      [FileText, "Release Brief"],
      [ClipboardCheck, "Launch Checklist"],
      [Megaphone, "Campaign Notes"],
      [CalendarClock, "Rollout Calendar"],
      [CloudUpload, "Ship Build"],
    ],
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: Inbox,
    rows: [
      [MessageCircle, "Client Feedback"],
      [Users, "Team Requests"],
      [BadgeCheck, "Approval Notes"],
    ],
  },
  {
    id: "flows",
    label: "Flows",
    icon: Workflow,
    rows: [
      [GitBranch, "Trigger Map"],
      [Webhook, "Webhook Runs"],
      [RefreshCw, "Retry Queue"],
    ],
  },
  {
    id: "assets",
    label: "Assets",
    icon: PackageOpen,
    rows: [
      [SwatchBook, "Brand Kit"],
      [Images, "Mockup Library"],
      [Brush, "Design Tokens"],
      [UploadCloud, "Export Queue"],
    ],
  },
  {
    id: "status",
    label: "Status",
    icon: ChartSpline,
    rows: [
      [Gauge, "Activation"],
      [ChartSpline, "Conversion"],
      [Siren, "Incidents"],
    ],
  },
];
const items: ExpandableTabsItem[] = sections.map(({ rows, ...section }) => ({
  ...section,
  content: content(rows),
}));
</script>

<template>
  <div class="flex min-h-88 w-full items-end justify-center">
    <ExpandableTabs :items="items" />
  </div>
</template>
