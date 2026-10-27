<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { h } from "vue";
import { Table, type TableColumn } from "../index";

interface DemoPerson {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  mrr: number;
}
const given = [
    "Ava",
    "Leo",
    "Mia",
    "Kai",
    "Zoe",
    "Eli",
    "Noa",
    "Ren",
    "Ivy",
    "Jude",
  ],
  families = [
    "Cole",
    "Frost",
    "Vale",
    "Reyes",
    "Okafor",
    "Sato",
    "Lund",
    "Marsh",
    "Bose",
    "Quinn",
  ];
const roles = ["Owner", "Admin", "Member", "Viewer"],
  statuses = ["active", "invited", "suspended"] as const;
function buildPeople(count: number, start = 0) {
  const entries: DemoPerson[] = [];
  for (let index = start; index < start + count; index++) {
    const first = given[index % given.length],
      last = families[(index * 7) % families.length];
    entries.push({
      id: String(index),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@example.com`,
      role: roles[(index * 3) % roles.length],
      status: statuses[(index * 5) % statuses.length],
      mrr: 12 + ((index * 37) % 488),
    });
  }
  return entries;
}
const tone = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  invited: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  suspended: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};
function peopleColumns(sortable: boolean): TableColumn<DemoPerson>[] {
  return [
    {
      key: "name",
      header: "Name",
      ...(sortable ? { sortable: true, width: "1.4fr" } : {}),
      cell: (row) => h("span", { class: "font-medium" }, row.name),
    },
    { key: "email", header: "Email", width: sortable ? "1.8fr" : "220px" },
    {
      key: "role",
      header: "Role",
      ...(sortable ? { sortable: true } : {}),
      width: sortable ? "120px" : "110px",
    },
    {
      key: "status",
      header: "Status",
      width: sortable ? "130px" : "120px",
      cell: (row) =>
        h(
          "span",
          {
            class:
              "rounded-full px-2 py-0.5 font-medium text-xs capitalize " +
              tone[row.status],
          },
          row.status,
        ),
    },
    {
      key: "mrr",
      header: "MRR",
      ...(sortable ? { sortable: true } : {}),
      align: "right",
      width: sortable ? "110px" : "100px",
      cell: (row) =>
        h("span", { class: "tabular-nums" }, "$" + row.mrr.toLocaleString()),
    },
  ];
}

const rows = ref<DemoPerson[]>([]),
  loading = ref(true),
  page = ref(0),
  columns = peopleColumns(false);
let request: ReturnType<typeof setTimeout> | undefined;
function loadMore() {
  if (request !== undefined || page.value >= 8) return;
  const requestedPage = page.value;
  loading.value = true;
  const publishPage = () => {
    const batch = buildPeople(20, requestedPage * 20);
    rows.value = rows.value.concat(batch);
    page.value = requestedPage + 1;
    request = undefined;
    loading.value = false;
  };
  request = setTimeout(publishPage, 700);
}
onMounted(loadMore);
onBeforeUnmount(() => clearTimeout(request));
</script>
<template>
  <div class="flex w-full justify-center p-4">
    <div class="flex w-full flex-col gap-2">
      <div
        class="flex items-center justify-between px-1 text-xs text-muted-foreground"
      >
        <span>{{ rows.length.toLocaleString() }} loaded</span
        ><span>{{
          loading ? "Loading…" : page >= 8 ? "All loaded" : "Scroll for more"
        }}</span>
      </div>
      <Table
        :data="rows"
        :columns="columns"
        :get-row-id="(row) => row.id"
        :height="420"
        :row-height="52"
        :on-end-reached="loadMore"
        :loading="loading"
        class="rounded-2xl"
      />
    </div>
  </div>
</template>
