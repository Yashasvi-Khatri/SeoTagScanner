import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as jwt from 'jsonwebtoken';
import { getUserScans } from '../../server/models/scanModel.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET not configured" });
    }

    const decoded = jwt.verify(token, secret) as { userId: string; email: string };
    
    const history = await getUserScans(decoded.userId);

    return res.status(200).json({ history });
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Failed to fetch scan history" });
  }
}
