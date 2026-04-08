import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const DAILY_SCAN_LIMIT = 20;

async function requireAuth(req: VercelRequest): Promise<string> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token required");
  }
  
  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  
  const decoded = jwt.verify(token, secret) as any;
  return decoded.userId;
}

async function countTodayScans(userId: string): Promise<number> {
  const today = new Date().toISOString().split("T")[0];
  const startOfDay = `${today}T00:00:00.000Z`;
  const endOfDay = `${today}T23:59:59.999Z`;
  
  const { count, error } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("scanned_at", startOfDay)
    .lte("scanned_at", endOfDay);
  
  if (error) throw error;
  return count || 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const userId = await requireAuth(req);
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ message: "URL query parameter is required" });
      }
      
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ message: "Invalid URL format" });
      }
      
      const todayCount = await countTodayScans(userId);
      if (todayCount >= DAILY_SCAN_LIMIT) {
        return res.status(429).json({
          message: `Daily scan limit of ${DAILY_SCAN_LIMIT} reached. Try again tomorrow.` 
        });
      }
      
      let response;
      try {
        response = await axios.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          },
          timeout: 10000,
          maxRedirects: 5
        });
      } catch (error) {
        return res.status(502).json({ message: "Failed to fetch website", error: (error as any).message });
      }
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      const metaTags: any[] = [];
      $("meta").each((_i, el) => {
        const attrs: any = {};
        Object.keys(el.attribs).forEach((attr) => {
          attrs[attr] = el.attribs[attr];
        });
        metaTags.push(attrs);
      });
      
      const linkTags: any[] = [];
      $("link").each((_i, el) => {
        const attrs: any = {};
        Object.keys(el.attribs).forEach((attr) => {
          attrs[attr] = el.attribs[attr];
        });
        linkTags.push(attrs);
      });
      
      const title = $("title").text().trim();
      const description = metaTags.find((t) => t.name === "description");
      const robots = metaTags.find((t) => t.name === "robots");
      const viewport = metaTags.find((t) => t.name === "viewport");
      const canonical = linkTags.find((t) => t.rel === "canonical");
      const hreflang = linkTags.filter((t) => t.rel === "alternate" && t.hreflang);
      const favicon = linkTags.find(
        (t) => t.rel === "icon" || t.rel === "shortcut icon" || t.rel === "apple-touch-icon"
      );
      
      const ogTags = metaTags.filter(
        (t) => Object.keys(t).some((attr) => attr === "property" && t[attr].startsWith("og:"))
      );
      const twitterTags = metaTags.filter(
        (t) => Object.keys(t).some((attr) => attr === "name" && t[attr].startsWith("twitter:"))
      );
      
      const ogTitle = ogTags.find((t) => t.property === "og:title")?.content ?? null;
      const ogDescription = ogTags.find((t) => t.property === "og:description")?.content ?? null;
      const ogImage = ogTags.find((t) => t.property === "og:image")?.content ?? null;
      
      const h1Count = $("h1").length;
      const allImages = $("img");
      const totalImages = allImages.length;
      const imagesWithAlt = allImages.filter((_i, el) => !!$(el).attr("alt")).length;
      const imagesMissingAlt = totalImages - imagesWithAlt;
      
      const analysisData = {
        url,
        title,
        metaTags: { description, viewport, robots, canonical },
        socialTags: { openGraph: ogTags, twitter: twitterTags },
        linkTags: { hreflang, favicon },
        enriched: {
          ogTitle,
          ogDescription,
          ogImage,
          h1Count,
          totalImages,
          imagesWithAlt,
          imagesMissingAlt
        },
        allMetaTags: metaTags,
        allLinkTags: linkTags
      };
      
      // Save scan to database
      await supabase
        .from("scans")
        .insert({ user_id: userId, url, result: analysisData });
      
      return res.status(200).json(analysisData);
    } catch (err: any) {
      console.error("Scan error:", err);
      return res.status(500).json({ message: "Scan failed", error: err.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
