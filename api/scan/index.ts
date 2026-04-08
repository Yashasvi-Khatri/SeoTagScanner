import axios from "axios";
import * as cheerio from "cheerio";
import jwt from "jsonwebtoken";
import { saveScan, getUserScans, countTodayScans } from "../../server/models/scanModel.js";
import { ScanResult } from "../types";

const DAILY_SCAN_LIMIT = 20;

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    
    if (!secret) throw new Error("JWT_SECRET not configured");

    const decoded = jwt.verify(token, secret) as { userId: string; email: string };
    const userId = decoded.userId;

    const url = req.query.url as string;

    if (!url) {
      return res.status(400).json({ message: "URL query parameter is required" });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // Enforce daily rate limit via scan history in DB
    const todayCount = await countTodayScans(userId);
    if (todayCount >= DAILY_SCAN_LIMIT) {
      return res.status(429).json({
        message: `Daily scan limit of ${DAILY_SCAN_LIMIT} reached. Try again tomorrow.`,
      });
    }

    // Fetch the webpage
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        timeout: 10000,
        maxRedirects: 5,
      });
    } catch (error: any) {
      return res.status(502).json({ message: "Failed to fetch website", error: error.message });
    }

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract all meta tags
    const metaTags: Record<string, string>[] = [];
    $("meta").each((_i, el) => {
      const attrs: Record<string, string> = {};
      Object.keys(el.attribs).forEach((attr) => { attrs[attr] = el.attribs[attr]; });
      metaTags.push(attrs);
    });

    // Extract link tags
    const linkTags: Record<string, string>[] = [];
    $("link").each((_i, el) => {
      const attrs: Record<string, string> = {};
      Object.keys(el.attribs).forEach((attr) => { attrs[attr] = el.attribs[attr]; });
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

    const ogTags = metaTags.filter((t) =>
      Object.keys(t).some((attr) => attr === "property" && t[attr].startsWith("og:"))
    );
    const twitterTags = metaTags.filter((t) =>
      Object.keys(t).some((attr) => attr === "name" && t[attr].startsWith("twitter:"))
    );

    const ogTitle = ogTags.find((t) => t.property === "og:title")?.content ?? null;
    const ogDescription = ogTags.find((t) => t.property === "og:description")?.content ?? null;
    const ogImage = ogTags.find((t) => t.property === "og:image")?.content ?? null;

    // H1 count and image alt coverage
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
        imagesMissingAlt,
      },
      allMetaTags: metaTags,
      allLinkTags: linkTags,
    };

    // Persist via model
    await saveScan(userId, url, analysisData);

    return res.status(200).json(analysisData);
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Scan error:", err);
    return res.status(500).json({ message: "Scan failed", error: err.message });
  }
}
