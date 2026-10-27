<script setup lang="ts">
import { computed, ref } from "vue";
import { Table, type TableColumn } from "../index";
import { Switch } from "../../switch";
const rows = ref<Record<string, string>[]>([
  { id: "r1", name: "Ava Cole", role: "Owner", team: "Design" },
  { id: "r2", name: "Leo Frost", role: "Admin", team: "Growth" },
  { id: "r3", name: "Mia Vale", role: "Member", team: "Design" },
  { id: "r4", name: "Kai Reyes", role: "Member", team: "Platform" },
]);
const keys = ref(["name", "role", "team"]),
  labels = ref<Record<string, string>>({
    name: "Name",
    role: "Role",
    team: "Team",
  }),
  editable = ref(true);
let rowSequence = 5,
  columnSequence = 1;
const columns = computed<TableColumn<Record<string, string>>[]>(() =>
  keys.value.map((key, index) => ({
    key,
    header: labels.value[key] ?? key,
    editable: editable.value,
    width: index ? "180px" : undefined,
  })),
);
function edit(id: string, key: string, value: string) {
  rows.value = rows.value.map((row) =>
    row.id === id ? { ...row, [key]: value } : row,
  );
}
function insertRow(index: number, position: "before" | "after") {
  rows.value.splice(index + (position === "after" ? 1 : 0), 0, {
    id: `r${rowSequence++}`,
  });
}
function deleteRow(id: string) {
  rows.value = rows.value.filter((row) => row.id !== id);
}
function rename(key: string, value: string) {
  labels.value = { ...labels.value, [key]: value };
}
function insertColumn(index: number, position: "before" | "after") {
  const key = `field${columnSequence}`;
  labels.value[key] = `Field ${columnSequence++}`;
  keys.value.splice(index + (position === "after" ? 1 : 0), 0, key);
  rows.value = rows.value.map((row) => ({ ...row, [key]: "" }));
}
function deleteColumn(key: string) {
  keys.value = keys.value.filter((entry) => entry !== key);
  rows.value = rows.value.map((row) =>
    Object.fromEntries(Object.entries(row).filter(([entry]) => entry !== key)),
  );
}
</script>
<template>
  <div class="flex w-full flex-col gap-3 p-4">
    <div class="flex items-center justify-between">
      <p class="text-xs text-muted-foreground">
        {{
          editable
            ? "Click a cell to edit. Use the column and row handles to insert or delete."
            : "Read-only."
        }}
      </p>
      <Switch v-model="editable" label="Editable" />
    </div>
    <Table
      :data="rows"
      :columns="columns"
      :get-row-id="(row) => row.id"
      :row-height="48"
      :height="Math.min(Math.max(rows.length, 1), 6) * 48"
      :on-cell-edit="editable ? edit : undefined"
      :on-column-rename="editable ? rename : undefined"
      :on-insert-row="editable ? insertRow : undefined"
      :on-delete-row="editable ? deleteRow : undefined"
      :on-insert-column="editable ? insertColumn : undefined"
      :on-delete-column="editable ? deleteColumn : undefined"
      ><template #empty
        ><button
          type="button"
          class="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          @click="insertRow(0, 'before')"
        >
          Insert first row
        </button></template
      ></Table
    >
  </div>
</template>
