import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as jwt from 'jsonwebtoken';
import { getUserScans } from '../../server/models/scanModel.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== SCAN HISTORY API REQUEST ===')
  console.log('Method:', req.method)
  console.log('Headers:', req.headers)
  console.log('Environment check:')
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'MISSING')
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING')
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING')
  
  if (req.method !== 'GET') {
    console.error('Method not allowed:', req.method)
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log('Step 1: Extracting and validating token')
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? 'PRESENT' : 'MISSING')
    
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      console.error('No token provided')
      return res.status(401).json({ message: "Unauthorized" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not configured')
      return res.status(500).json({ message: "JWT_SECRET not configured" });
    }

    console.log('Step 2: Verifying JWT token')
    const decoded = jwt.verify(token, secret) as { userId: string; email: string };
    console.log('Token verified for user:', decoded.userId)
    
    console.log('Step 3: Fetching scan history from database')
    const history = await getUserScans(decoded.userId);
    console.log('Scan history fetched, count:', history.length)

    console.log('=== SCAN HISTORY API SUCCESS ===')
    return res.status(200).json({ history });
  } catch (err: any) {
    console.error('=== SCAN HISTORY API ERROR ===')
    console.error('Error type:', err.constructor.name)
    console.error('Error message:', err.message)
    console.error('Error stack:', err.stack)
    console.error('User ID:', req.headers.authorization ? 'JWT_PRESENT' : 'NO_AUTH')
    
    // Check for specific database errors
    if (err.message?.includes('SUPABASE') || err.message?.includes('supabase')) {
      console.error('DATABASE CONNECTION ERROR DETECTED')
    }
    
    // Check for JWT specific errors
    if (err.name === 'JsonWebTokenError') {
      console.error('JWT Token Error: Invalid token')
      return res.status(401).json({ message: "Invalid token" });
    }
    
    if (err.name === 'TokenExpiredError') {
      console.error('JWT Token Error: Token expired')
      return res.status(401).json({ message: "Token expired" });
    }
    
    // Check for network errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
      console.error('NETWORK ERROR DETECTED:', err.code)
    }
    
    console.error('Generic database or server error')
    return res.status(500).json({ message: "Failed to fetch scan history" });
  }
}
