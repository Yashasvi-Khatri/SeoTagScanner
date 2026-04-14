import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verify } from 'jsonwebtoken';
import { findUserById } from '../../lib/userModel.js';

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

    const decoded = verify(token, secret) as { userId: string; email: string };
    
    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userTyped = user as { id: string; email: string };

    return res.status(200).json({ user: { id: userTyped.id, email: userTyped.email } });
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Failed to fetch user" });
  }
}
