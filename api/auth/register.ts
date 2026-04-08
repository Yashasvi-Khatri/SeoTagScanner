import { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

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

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const { data: existing, error: existingError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existing && !existingError) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    const { data: user, error } = await supabase
      .from("users")
      .insert({ email, password_hash: passwordHash })
      .select()
      .single();

    if (error) throw error;

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
