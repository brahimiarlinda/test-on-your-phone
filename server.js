// A tiny web server with zero dependencies.
// It listens on your whole Wi-Fi (not just "localhost"),
// so your phone can open the page too.

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = Number(process.env.PORT) || 3000;

// "0.0.0.0" means: accept visitors from any device on the network.
// Change it to "127.0.0.1" and your phone will no longer be able to connect.
const HOST = process.env.HOST || "0.0.0.0";

const PUBLIC_DIR = path.join(__dirname, "public");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

// Finds this computer's addresses on the local network (e.g. 192.168.1.23).
function networkAddresses() {
  const result = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const item of list || []) {
      if (item.family === "IPv4" && !item.internal) result.push(item.address);
    }
  }
  return result;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://placeholder");

  // A small API, so you can see that requests from the phone reach the laptop.
  if (url.pathname === "/api/hello") {
    const visitor = (req.socket.remoteAddress || "").replace("::ffff:", "");
    console.log(`  API call from ${visitor}`);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Hello from your laptop!",
        servedBy: os.hostname(),
        yourAddress: visitor,
        time: new Date().toISOString(),
      })
    );
    return;
  }

  // Serve files from the public folder.
  const file = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, file));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
      return;
    }
    const type = TYPES[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  const addresses = networkAddresses();
  console.log("\n  Server is running.\n");
  console.log(`  On this computer:  http://localhost:${PORT}`);
  if (HOST === "0.0.0.0" && addresses.length) {
    for (const a of addresses) console.log(`  On your phone:     http://${a}:${PORT}`);
    console.log("\n  Phone and computer must be on the same Wi-Fi.");
  } else {
    console.log("  (Listening on this computer only, the phone can't connect.)");
  }
  console.log("  Press Ctrl+C to stop.\n");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  Port ${PORT} is already in use. Try: PORT=3001 npm start\n`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
