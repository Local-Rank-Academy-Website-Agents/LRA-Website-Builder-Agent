import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";

const projectRoot = process.cwd();
const root = path.join(projectRoot, fs.existsSync(path.join(projectRoot, "dist")) ? "dist" : "site");
const config = JSON.parse(fs.readFileSync(path.join(projectRoot, "site.config.json"), "utf8"));
const port = Number(process.env.PORT || config.previewPort || 4183);
const types = { ".css":"text/css; charset=utf-8", ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8", ".svg":"image/svg+xml", ".xml":"application/xml; charset=utf-8", ".txt":"text/plain; charset=utf-8", ".webp":"image/webp", ".png":"image/png", ".ttf":"font/ttf" };

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  let file = path.join(root, pathname === "/" ? "index.html" : pathname);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { response.statusCode = 404; file = path.join(root, "404.html"); }
  response.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(response);
});
server.listen(port, () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`Previewing ${root} at ${url}`);
  if (process.argv.includes("--open")) spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore", windowsHide: true }).unref();
});
