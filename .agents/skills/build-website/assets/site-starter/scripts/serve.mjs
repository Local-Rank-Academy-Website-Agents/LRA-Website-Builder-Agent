import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";

const root = path.join(process.cwd(), fs.existsSync("dist") ? "dist" : "site");
const port = Number(process.env.PORT || 4173);
const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml" };

http
  .createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    let file = path.join(root, pathname === "/" ? "index.html" : pathname);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      response.statusCode = 404;
      file = path.join(root, "404.html");
    }
    response.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
    fs.createReadStream(file).pipe(response);
  })
  .listen(port, () => console.log(`Previewing ${root} at http://localhost:${port}`));
