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

  // API Route to Create WebRTC Rooms using Daily.co REST API safely
  app.post("/api/rooms", async (req, res) => {
    try {
      const apiKey = process.env.DAILY_API_KEY;
      if (!apiKey) {
        console.warn("[DAILY WARNING] DAILY_API_KEY is not defined. Using generated secure fallback URL.");
        // Non-blocking fallback for local preview or development when secrets are not yet fully bound
        const generatedId = "sf-room-" + Math.random().toString(36).substring(2, 12);
        return res.json({ 
          url: `https://iframe.daily.co/${generatedId}`, 
          name: generatedId,
          warning: "DAILY_API_KEY is missing, using unique fallback"
        });
      }

      const { prefix } = req.body;
      const uniqueSuffix = Math.random().toString(36).substring(2, 10);
      const roomName = `${prefix || "secureflow"}-${uniqueSuffix}`;

      console.log(`[DAILY] Requesting room creation for: ${roomName}`);

      const dailyResponse = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          name: roomName,
          properties: {
            enable_chat: true,
            start_audio_off: false,
            start_video_off: false,
            exp: Math.floor(Date.now() / 1000) + 7200 // Expires in 2 hours
          }
        })
      });

      if (!dailyResponse.ok) {
        const errText = await dailyResponse.text();
        console.error(`[DAILY ERROR] Code ${dailyResponse.status}:`, errText);
        throw new Error(`Daily.co backend returned error: ${errText}`);
      }

      const roomData = await dailyResponse.json();
      console.log(`[DAILY SUCCESS] Room created successfully: ${roomData.url}`);
      return res.json({
        url: roomData.url,
        name: roomData.name
      });
    } catch (err: any) {
      console.error("[DAILY API ERROR]", err);
      // Fallback fallback to ensure frontend does not block completely if Daily.co API is down
      const emergencyId = "sf-backup-" + Math.random().toString(36).substring(2, 10);
      return res.json({
        url: `https://iframe.daily.co/${emergencyId}`,
        name: emergencyId,
        error: err.message
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
