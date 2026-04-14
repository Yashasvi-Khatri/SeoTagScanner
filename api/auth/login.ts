import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../../lib/userModel.js';

function signToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign({ userId, email }, secret, { expiresIn: "7d" });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== LOGIN API REQUEST ===')
  console.log('Method:', req.method)
  console.log('Headers:', req.headers)
  console.log('Environment check:')
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'MISSING')
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING')
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING')
  
  if (req.method !== 'POST') {
    console.error('Method not allowed:', req.method)
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log('Step 1: Parsing request body')
    const { email, password } = req.body;
    console.log('Email provided:', email ? 'YES' : 'NO')
    console.log('Password provided:', password ? 'YES' : 'NO')

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
    console.error('=== LOGIN API ERROR ===')
    console.error('Error type:', err.constructor.name)
    console.error('Error message:', err.message)
    console.error('Error stack:', err.stack)
    console.error('Request body:', req.body)
    
    // Check for specific database errors
    if (err.message?.includes('SUPABASE') || err.message?.includes('supabase')) {
      console.error('DATABASE CONNECTION ERROR DETECTED')
    }
    
    // Check for JWT errors
    if (err.message?.includes('JWT_SECRET')) {
      console.error('JWT CONFIGURATION ERROR DETECTED')
    }
    
    // Check for bcrypt errors
    if (err.message?.includes('bcrypt')) {
      console.error('PASSWORD COMPARISON ERROR DETECTED')
    }
    
    return res.status(500).json({ 
      message: "Login failed",
      error: err.message,
      details: {
        type: err.constructor.name,
        environment: {
          supabase: process.env.SUPABASE_URL ? 'configured' : 'missing',
          jwt: process.env.JWT_SECRET ? 'configured' : 'missing'
        }
      }
    });
  }
}
