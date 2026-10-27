import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts", "packages/vue/src/**/tests/**/*.test.ts"],
    // Keep Vue/TypeScript-heavy suites within the 16 GiB development host.
    maxWorkers: 2,
    testTimeout: 15000,
  },
});
