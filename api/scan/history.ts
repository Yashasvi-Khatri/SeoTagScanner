import jwt from "jsonwebtoken";
import { getUserScans } from "../../server/models/scanModel.js";
import { ScanResult, ScanHistory } from "../types";

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    
    if (!secret) throw new Error("JWT_SECRET not configured");

    const decoded = jwt.verify(token, secret) as { userId: string; email: string };
    const userId = decoded.userId;

    // Fetch via model
    const scans = await getUserScans(userId) as ScanResult[];

    const history = scans.map((s: ScanResult) => ({
      id: s.id,
      url: s.url,
      title: s.result?.title ?? null,
      description: s.result?.metaTags?.description?.content ?? null,
      created_at: s.scanned_at,
    }));

    return res.status(200).json(history);
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Failed to fetch scan history" });
  }
}
