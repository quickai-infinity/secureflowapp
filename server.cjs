var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.use(import_express.default.urlencoded({ extended: true }));
  app.post("/api/webhook-proxy", async (req, res) => {
    try {
      const targetUrl = req.query.url || "https://panel1.quickai.agency/webhook/abogadoya-agente";
      console.log(`[PROXY] Forwarding request to: ${targetUrl}`);
      console.log(`[PROXY] Body:`, JSON.stringify(req.body));
      const webhookRes = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(req.body)
      });
      const textData = await webhookRes.text();
      console.log(`[PROXY] Target responded with status ${webhookRes.status}:`, textData);
      res.status(webhookRes.status);
      const contentType = webhookRes.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          res.json(JSON.parse(textData));
        } catch {
          res.send(textData);
        }
      } else {
        res.send(textData);
      }
    } catch (err) {
      console.error("[PROXY ERROR] Failed to contact n8n webhook:", err);
      res.status(500).json({
        error: "Failed to communicate with the central artificial intelligence module",
        details: err.message
      });
    }
  });
  let distPath = import_path.default.join(process.cwd(), "dist");
  let isDev = process.env.NODE_ENV !== "production";
  try {
    if (typeof __dirname !== "undefined") {
      const isCjsInDist = __dirname.endsWith("dist") || __dirname.includes("/dist");
      if (isCjsInDist) {
        distPath = __dirname;
        isDev = false;
      }
    }
  } catch (e) {
  }
  if (isDev) {
    console.log("[SERVER] Starting Vite development middleware...");
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log(`[SERVER] Static serving from: ${distPath}`);
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] SecureFlow fullstack engine running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
