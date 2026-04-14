import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { findUserByEmail } from '../../server/models/userModel.js';

function signToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign({ userId, email }, secret, { expiresIn: "7d" });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const userTyped = user as { id: string; email: string; password_hash: string };

    const valid = await bcrypt.compare(password, userTyped.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(userTyped.id, userTyped.email);

    return res.status(200).json({
      token,
      user: { id: userTyped.id, email: userTyped.email },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
}
