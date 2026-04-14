import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { saveScan } from '../../lib/scanModel.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
    return res.status(200).json({
      scan,
      analysis: result,
      // also spread at top level for frontend compatibility
      ...result
    });
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
  console.log('Starting comprehensive SEO analysis for:', url)
  
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
    
    const $ = cheerio.load(html);

    // Essential tags
    const title = $('title').first().text().trim() || null;
    const description = $('meta[name="description"]').attr('content') || null;
    const canonical = $('link[rel="canonical"]').attr('href') || null;
    const viewport = $('meta[name="viewport"]').attr('content') || null;
    const robots = $('meta[name="robots"]').attr('content') || null;

    // Open Graph tags
    const ogTitle = $('meta[property="og:title"]').attr('content') || null;
    const ogDescription = $('meta[property="og:description"]').attr('content') || null;
    const ogImage = $('meta[property="og:image"]').attr('content') || null;
    const ogUrl = $('meta[property="og:url"]').attr('content') || null;
    const ogType = $('meta[property="og:type"]').attr('content') || null;

    // Twitter tags
    const twitterCard = $('meta[name="twitter:card"]').attr('content') || null;
    const twitterTitle = $('meta[name="twitter:title"]').attr('content') || null;
    const twitterDescription = $('meta[name="twitter:description"]').attr('content') || null;
    const twitterImage = $('meta[name="twitter:image"]').attr('content') || null;

    // Technical
    const h1Tags = $('h1').map((_index: number, el: any) => $(el).text().trim()).get();
    const h1Count = h1Tags.length;
    const imagesWithoutAlt = $('img:not([alt])').length;
    const lang = $('html').attr('lang') || null;

    // Build allMetaTags array (what frontend renders in tag list)
    const allMetaTags: any[] = [];
    $('meta').each((_index: number, el: any) => {
      const name = $(el).attr('name') || $(el).attr('property') || $(el).attr('http-equiv');
      const content = $(el).attr('content');
      if (name && content) {
        allMetaTags.push({ name, content });
      }
    });

    // Build structured response matching frontend expectations
    const result = {
      url,
      title,
      description,
      h1Count,
      h1Tags,
      imagesWithoutAlt,
      lang,
      allMetaTags,
      metaTags: {
        description,
        canonical,
        viewport,
        robots,
      },
      socialTags: {
        openGraph: [
          ogTitle && { property: 'og:title', content: ogTitle },
          ogDescription && { property: 'og:description', content: ogDescription },
          ogImage && { property: 'og:image', content: ogImage },
          ogUrl && { property: 'og:url', content: ogUrl },
          ogType && { property: 'og:type', content: ogType },
        ].filter(Boolean),
        twitter: [
          twitterCard && { name: 'twitter:card', content: twitterCard },
          twitterTitle && { name: 'twitter:title', content: twitterTitle },
          twitterDescription && { name: 'twitter:description', content: twitterDescription },
          twitterImage && { name: 'twitter:image', content: twitterImage },
        ].filter(Boolean),
      },
      technicalTags: {
        canonical,
        viewport,
        robots,
        lang,
        h1Count,
        imagesWithoutAlt,
      },
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      twitterTitle,
      score: 0, // calculated below
    };

    result.score = calculateSEOScore(result);
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

function calculateSEOScore(data: any): number {
  let score = 0;
  if (data.title) score += 15;
  if (data.description) score += 15;
  if (data.metaTags?.canonical) score += 10;
  if (data.metaTags?.viewport) score += 10;
  if (data.ogTitle) score += 10;
  if (data.ogDescription) score += 10;
  if (data.ogImage) score += 5;
  if (data.twitterCard) score += 10;
  if (data.h1Count === 1) score += 10;
  if (data.imagesWithoutAlt === 0) score += 5;
  return Math.min(score, 100);
}
