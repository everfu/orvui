import { createServer } from "node:net";
import { spawn } from "node:child_process";

// Nuxt normally picks another port; comparisons require this exact address.
const probe = createServer();
probe.once("error", () => {
  console.error(
    "Nuxt docs require 127.0.0.1:5174. Stop the process using this port first.",
  );
  process.exitCode = 1;
});
probe.listen(5174, "127.0.0.1", () =>
  probe.close(() => {
    const child = spawn(
      "pnpm",
      ["exec", "nuxt", "dev", "--host", "127.0.0.1", "--port", "5174"],
      { stdio: "inherit" },
    );
    for (const signal of ["SIGINT", "SIGTERM"])
      process.on(signal, () => child.kill(signal));
    child.on("exit", (code) => {
      process.exitCode = code ?? 1;
    });
  }),
);
