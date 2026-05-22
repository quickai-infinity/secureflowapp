import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use raw and json parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API CORS-free Webhook Proxy
  app.post("/api/webhook-proxy", async (req, res) => {
    try {
      const targetUrl = (req.query.url as string) || "https://panel1.quickai.agency/webhook/abogadoya-agente";
      
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

      // Set headers and forward status
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
    } catch (err: any) {
      console.error("[PROXY ERROR] Failed to contact n8n webhook:", err);
      res.status(500).json({ 
        error: "Failed to communicate with the central artificial intelligence module", 
        details: err.message 
      });
    }
  });

  // Robust path resolution and environment checking
  let distPath = path.join(process.cwd(), "dist");
  let isDev = process.env.NODE_ENV !== "production";

  // Safely check if we are running from a bundled CJS file inside dist
  try {
    if (typeof __dirname !== "undefined") {
      const isCjsInDist = __dirname.endsWith("dist") || __dirname.includes("/dist");
      if (isCjsInDist) {
        distPath = __dirname;
        isDev = false;
      }
    }
  } catch (e) {
    // Ignore ReferenceError for __dirname in pure ESM
  }

  if (isDev) {
    console.log("[SERVER] Starting Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log(`[SERVER] Static serving from: ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] SecureFlow fullstack engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
