import { Response } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { db } from "../db";
import { seoResults, dailyScanCounts } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { AuthRequest } from "../middleware/auth";

const DAILY_SCAN_LIMIT = 20;

export async function scanUrl(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const url = req.query.url as string;

    if (!url) {
      return res.status(400).json({ message: "URL query parameter is required" });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // Check daily rate limit
    const today = new Date().toISOString().split("T")[0];
    const [existing] = await db
      .select()
      .from(dailyScanCounts)
      .where(and(eq(dailyScanCounts.user_id, userId), eq(dailyScanCounts.scan_date, today)))
      .limit(1);

    if (existing && existing.count >= DAILY_SCAN_LIMIT) {
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
      Object.keys(el.attribs).forEach((attr) => {
        attrs[attr] = el.attribs[attr];
      });
      metaTags.push(attrs);
    });

    // Extract link tags
    const linkTags: Record<string, string>[] = [];
    $("link").each((_i, el) => {
      const attrs: Record<string, string> = {};
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

    const ogTags = metaTags.filter((t) =>
      Object.keys(t).some((attr) => attr === "property" && t[attr].startsWith("og:"))
    );
    const twitterTags = metaTags.filter((t) =>
      Object.keys(t).some((attr) => attr === "name" && t[attr].startsWith("twitter:"))
    );

    const ogTitle = ogTags.find((t) => t.property === "og:title")?.content || null;
    const ogDescription = ogTags.find((t) => t.property === "og:description")?.content || null;
    const ogImage = ogTags.find((t) => t.property === "og:image")?.content || null;

    // H1 count
    const h1Count = $("h1").length;

    // Image alt tag coverage
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

    // Save to DB
    const timestamp = new Date().toISOString();
    await db.insert(seoResults).values({
      user_id: userId,
      url,
      title,
      description: description?.content ?? null,
      score: 0,
      analysis_data: JSON.stringify(analysisData),
      created_at: timestamp,
    });

    // Update daily scan count
    if (existing) {
      await db
        .update(dailyScanCounts)
        .set({ count: existing.count + 1 })
        .where(eq(dailyScanCounts.id, existing.id));
    } else {
      await db.insert(dailyScanCounts).values({
        user_id: userId,
        scan_date: today,
        count: 1,
      });
    }

    return res.status(200).json(analysisData);
  } catch (err: any) {
    console.error("Scan error:", err);
    return res.status(500).json({ message: "Scan failed", error: err.message });
  }
}

export async function getScanHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const rows = await db
      .select()
      .from(seoResults)
      .where(eq(seoResults.user_id, userId))
      .orderBy(seoResults.id);

    const history = rows.reverse().slice(0, 20).map((r) => ({
      id: r.id,
      url: r.url,
      title: r.title,
      description: r.description,
      created_at: r.created_at,
    }));

    return res.status(200).json(history);
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch scan history" });
  }
}
