import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth";

// Model imports — all DB logic lives here, controllers never touch Supabase directly
// @ts-ignore — JS model files
import { createUser, findUserByEmail, findUserById } from "../models/userModel.js";

function signToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign({ userId, email }, secret, { expiresIn: "7d" });
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser(email, passwordHash);

    const token = signToken(user.id, user.email);

    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err: any) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user.id, user.email);

    return res.status(200).json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await findUserById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user: { id: user.id, email: user.email } });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
}
