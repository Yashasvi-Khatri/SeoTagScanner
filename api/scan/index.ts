import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as jwt from 'jsonwebtoken';
import { saveScan } from '../../server/models/scanModel.js';
import axios from 'axios';

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason)
})

export const config = { maxDuration: 30 }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== SCAN API REQUEST ===')
  console.log('Method:', req.method)
  console.log('Query:', req.query)
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
    
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      console.error('Invalid URL parameter:', req.query.url)
      return res.status(400).json({ message: "URL is required" });
    }

    console.log('Step 3: Validating URL format')
    // Validate URL format
    try {
      new URL(url);
      console.log('URL format valid:', url)
    } catch (urlError) {
      console.error('Invalid URL format:', urlError instanceof Error ? urlError.message : 'Unknown error')
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log('Step 4: Starting SEO analysis')
    // Basic SEO analysis
    const result = await analyzeSEO(url);
    console.log('SEO analysis completed, score:', result.score)
    
    console.log('Step 5: Saving scan to database')
    const scan = await saveScan(decoded.userId, url, result);
    console.log('Scan saved successfully, ID:', scan.id)

    console.log('=== SCAN API SUCCESS ===')
    return res.status(200).json({ scan, analysis: result });
  } catch (error: any) {
    console.error('=== SCAN API ERROR ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Request URL:', req.query.url)
    console.error('User ID:', req.headers.authorization ? 'JWT_PRESENT' : 'NO_AUTH')
    
    // Check for specific database errors
    if (error.message?.includes('SUPABASE') || error.message?.includes('supabase')) {
      console.error('DATABASE CONNECTION ERROR DETECTED')
    }
    
    // Check for network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      console.error('NETWORK ERROR DETECTED:', error.code)
    }
    
    return res.status(500).json({
      error: 'Scan failed',
      details: error.message,
      tags: [],
      recommendations: [],
      score: 0
    })
  }
}

async function analyzeSEO(url: string) {
  console.log('Starting SEO analysis for:', url)
  
  try {
    console.log('Fetching HTML content...')
    const { data: html } = await axios.get(url, {
      timeout: 20000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });
    
    console.log('HTML fetched, length:', html.length)
    
    // Basic SEO analysis (you can expand this)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    console.log('Title found:', title ? 'YES' : 'NO')
    
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : null;
    console.log('Description found:', description ? 'YES' : 'NO')
    
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : null;
    console.log('OG Title found:', ogTitle ? 'YES' : 'NO')
    
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogDescription = ogDescMatch ? ogDescMatch[1].trim() : null;
    console.log('OG Description found:', ogDescription ? 'YES' : 'NO')
    
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    console.log('H1 count:', h1Count)
    
    const result = {
      url,
      title,
      description,
      ogTitle,
      ogDescription,
      h1Count,
      score: calculateSEOScore({ title, description, ogTitle, ogDescription, h1Count })
    };
    
    console.log('SEO analysis completed, score:', result.score)
    return result;
  } catch (error: any) {
    console.error('SEO ANALYSIS ERROR:')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Target URL:', url)
    
    // Check for specific axios errors
    if (error.response) {
      console.error('HTTP Error Status:', error.response.status)
      console.error('HTTP Error Data:', error.response.data)
    } else if (error.request) {
      console.error('Network Error - No response received')
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to analyze ${url}: ${errorMessage}`);
  }
}

function calculateSEOScore(data: any) {
  let score = 0;
  if (data.title) score += 20;
  if (data.description) score += 20;
  if (data.ogTitle) score += 15;
  if (data.ogDescription) score += 15;
  if (data.h1Count === 1) score += 15;
  if (data.h1Count > 0) score += 10;
  return Math.min(score, 100);
}
