import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import authRoutes from "./routes/auth";
import scanRoutes from "./routes/scan";

export async function registerRoutes(app: Express): Promise<Server> {
  // CORS — allow configured origins in production, any in dev
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (process.env.NODE_ENV !== "production") return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  // Health check endpoint
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  // Auth routes: /api/auth/register, /api/auth/login, /api/auth/me
  app.use("/api/auth", authRoutes);

  // Scan routes: GET /api/scan?url=... (protected), GET /api/scan/history (protected)
  app.use("/api/scan", scanRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
