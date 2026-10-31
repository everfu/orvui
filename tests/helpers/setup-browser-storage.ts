// Bind browser storage explicitly: Node 24 also exposes storage globals, which
// Vitest 3 otherwise keeps instead of Happy DOM when populating the environment.
if (typeof window !== "undefined" && typeof Storage === "function") {
  for (const key of ["localStorage", "sessionStorage"]) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value: new Storage(),
    });
  }
}
