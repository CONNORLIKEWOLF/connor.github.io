import http from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4"
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = normalize(join(root, decodeURIComponent(requestedPath)));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const stats = statSync(filePath);
    const contentType = types[extname(filePath)] || "application/octet-stream";
    const range = request.headers.range;

    if (range && extname(filePath) === ".mp4") {
      const match = range.match(/bytes=(\d*)-(\d*)/);
      const start = match && match[1] ? Number(match[1]) : 0;
      const end = match && match[2] ? Number(match[2]) : stats.size - 1;
      const safeEnd = Math.min(end, stats.size - 1);
      const chunkSize = safeEnd - start + 1;

      response.writeHead(206, {
        "Content-Type": contentType,
        "Content-Length": chunkSize,
        "Content-Range": `bytes ${start}-${safeEnd}/${stats.size}`,
        "Accept-Ranges": "bytes"
      });
      createReadStream(filePath, { start, end: safeEnd }).pipe(response);
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size,
      "Accept-Ranges": extname(filePath) === ".mp4" ? "bytes" : "none"
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}/`);
});
