import { Response } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { AuthRequest } from "../middleware/auth";

// Model imports — all DB logic lives here, controllers never touch Supabase directly
// @ts-ignore — JS model files
import { saveScan, getUserScans, countTodayScans } from "../models/scanModel.js";

const DAILY_SCAN_LIMIT = 20;

export async function scanUrl(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        timeout: 20000,
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

    // Persist via model — controller never calls Supabase directly
    await saveScan(userId, url, analysisData);

    return res.status(200).json(analysisData);
  } catch (err: any) {
    console.error("Scan error:", err);
    return res.status(500).json({ message: "Scan failed", error: err.message });
  }
}

export async function getScanHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;

    // Fetch via model — controller never calls Supabase directly
    const scans = await getUserScans(userId);

    const history = scans.map((s: any) => ({
      id: s.id,
      url: s.url,
      title: s.result?.title ?? null,
      description: s.result?.metaTags?.description?.content ?? null,
      created_at: s.scanned_at,
    }));

    return res.status(200).json(history);
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch scan history" });
  }
}
