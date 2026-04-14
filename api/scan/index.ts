import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as jwt from 'jsonwebtoken';
import { saveScan } from '../../server/models/scanModel.js';
import axios from 'axios';

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason)
})

export const config = { maxDuration: 30 }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Scan request received:', req.query)
  
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
    
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ message: "URL is required" });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Basic SEO analysis
    const result = await analyzeSEO(url);
    
    const scan = await saveScan(decoded.userId, url, result);
    console.log('Scan completed successfully')

    return res.status(200).json({ scan, analysis: result });
  } catch (error: any) {
    console.error('SCAN CRASHED:', {
      message: error.message,
      stack: error.stack,
      url: req.query.url
    })
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
  try {
    const { data: html } = await axios.get(url, {
      timeout: 20000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });
    
    // Basic SEO analysis (you can expand this)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : null;
    
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : null;
    
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogDescription = ogDescMatch ? ogDescMatch[1].trim() : null;
    
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    
    return {
      url,
      title,
      description,
      ogTitle,
      ogDescription,
      h1Count,
      score: calculateSEOScore({ title, description, ogTitle, ogDescription, h1Count })
    };
  } catch (error: any) {
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
