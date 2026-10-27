import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, sep, extname } from "node:path";

const root = fileURLToPath(new URL("../../", import.meta.url));
const port = Number(process.argv[2] ?? 5196);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Please supply a valid port number.");
}
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};
const sharedFiles = new Set([
  "/tools/social/card.html",
  "/assets/readme-logo.svg",
  "/apps/docs/public/fonts/source/geist-latin-400-normal.woff2",
  "/apps/docs/public/fonts/source/geist-latin-600-normal.woff2",
]);
const server = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const url = new URL(request.url, "http://127.0.0.1");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") {
      response.writeHead(302, { Location: "/assets/logo-exploration/" }).end();
      return;
    }
    if (pathname === "/assets/logo-exploration" || pathname === "/assets/logo-exploration/") {
      pathname = "/assets/logo-exploration/index.html";
    }
    const file = resolve(root, `.${pathname}`);
    const insidePreview = file.startsWith(resolve(root, "assets/logo-exploration") + sep);
    const insideBrand = file.startsWith(resolve(root, "assets/brand") + sep);
    const type = types[extname(file)];
    if ((!insidePreview && !insideBrand && !sharedFiles.has(pathname)) || !type || !(await stat(file)).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    if (request.method === "HEAD") response.end();
    else createReadStream(file).on("error", () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(404).end("Not found");
  }
});
server.listen(port, "127.0.0.1", () => {
  console.log(`orvui Logo preview: http://127.0.0.1:${port}/assets/logo-exploration/`);
});
