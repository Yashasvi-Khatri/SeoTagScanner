import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { saveScan } from '../../server/models/scanModel.js';

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
    
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ message: "URL is required" });
    }

    // Basic SEO analysis
    const result = await analyzeSEO(url);
    
    const scan = await saveScan(decoded.userId, url, result);

    return res.status(200).json({ scan, analysis: result });
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Scan error:", err);
    return res.status(500).json({ message: "Scan failed" });
  }
}

async function analyzeSEO(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
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
  } catch (error) {
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
