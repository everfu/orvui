export const demoPeople = [
  {
    id: "4586936",
    name: "Alex Morgan",
    email: "alex@example.com",
    role: "Product designer",
    type: "Employee",
  },
  {
    id: "4586937",
    name: "Maya Chen",
    email: "maya@example.com",
    role: "Design engineer",
    type: "Employee",
  },
  {
    id: "4586933",
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "Engineering lead",
    type: "Employee",
  },
  {
    id: "4586932",
    name: "Sam Rivera",
    email: "sam@example.com",
    role: "Creative director",
    type: "Contractor",
  },
  {
    id: "4586935",
    name: "Jamie Park",
    email: "jamie@example.com",
    role: "Vue developer",
    type: "Employee",
  },
  {
    id: "4586934",
    name: "Casey Ellis",
    email: "casey@example.com",
    role: "Marketing lead",
    type: "Contractor",
  },
];
export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
export const currency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export const amount = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );
export const count = (value: number) =>
  new Intl.NumberFormat("en-US").format(Math.round(value));
export function exportDemoCsv(name: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
    )
    .join("\r\n");
  const link = document.createElement("a");
  link.href = `data:text/csv;charset=utf-8,${encodeURIComponent("\uFEFF" + csv)}`;
  link.download = `${name}.csv`;
  link.click();
}
