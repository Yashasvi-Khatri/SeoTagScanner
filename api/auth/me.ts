import jwt from "jsonwebtoken";
import { findUserById } from "../../server/models/userModel.js";
import { User } from "../types";

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    
    if (!secret) throw new Error("JWT_SECRET not configured");

    const decoded = jwt.verify(token, secret) as { userId: string; email: string };
    
    const user = await findUserById(decoded.userId) as User | null;
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user: { id: user.id, email: user.email } });
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Failed to fetch user" });
  }
}
