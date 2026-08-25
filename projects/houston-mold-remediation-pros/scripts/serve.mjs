import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";

const root = path.join(process.cwd(), fs.existsSync("dist") ? "dist" : "site");
const port = Number(process.env.PORT || 4173);
const url = `http://localhost:${port}`;
const shouldOpen = process.argv.includes("--open");
const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".xml": "application/xml", ".txt": "text/plain" };

function openBrowser(target) {
  const platformCommand = process.platform === "win32"
    ? { command: "cmd.exe", args: ["/c", "start", "", target] }
    : process.platform === "darwin"
      ? { command: "open", args: [target] }
      : { command: "xdg-open", args: [target] };

  const child = spawn(platformCommand.command, platformCommand.args, {
    detached: true,
    stdio: "ignore",
    windowsHide: true
  });
  child.unref();
}

const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    let file = path.join(root, pathname === "/" ? "index.html" : pathname);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      response.statusCode = 404;
      file = path.join(root, "404.html");
    }
    response.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
    fs.createReadStream(file).pipe(response);
  });

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Close the other preview or run with a different PORT value.`);
    process.exit(1);
  }
  throw error;
});

server.listen(port, () => {
  console.log(`Previewing ${root} at ${url}`);
  console.log("Press Ctrl+C to stop the local preview.");
  if (shouldOpen) openBrowser(url);
});
