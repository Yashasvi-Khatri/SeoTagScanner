import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS
  app.use(cors());

  // Analyze a URL's SEO tags
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (e) {
        return res.status(400).json({ message: "Invalid URL format" });
      }

      // Fetch the webpage
      let response;
      try {
        response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 10000,
          maxRedirects: 5
        });
      } catch (error) {
        return res.status(500).json({ 
          message: "Failed to fetch website",
          error: error.message
        });
      }

      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract meta tags
      const metaTags = [];
      $('meta').each((i, el) => {
        const attributes = {};
        Object.keys(el.attribs).forEach(attr => {
          attributes[attr] = el.attribs[attr];
        });
        metaTags.push(attributes);
      });

      // Extract title
      const title = $('title').text();

      // Extract link tags (canonical, etc.)
      const linkTags = [];
      $('link').each((i, el) => {
        const attributes = {};
        Object.keys(el.attribs).forEach(attr => {
          attributes[attr] = el.attribs[attr];
        });
        linkTags.push(attributes);
      });

      // Extract Open Graph tags
      const ogTags = metaTags.filter(tag => 
        Object.keys(tag).some(attr => attr === 'property' && tag[attr].startsWith('og:'))
      );

      // Extract Twitter Card tags
      const twitterTags = metaTags.filter(tag => 
        Object.keys(tag).some(attr => attr === 'name' && tag[attr].startsWith('twitter:'))
      );

      // Extract other important SEO tags
      const robots = metaTags.find(tag => tag.name === 'robots');
      const viewport = metaTags.find(tag => tag.name === 'viewport');
      const description = metaTags.find(tag => tag.name === 'description');
      const canonical = linkTags.find(tag => tag.rel === 'canonical');
      const hreflang = linkTags.filter(tag => tag.rel === 'alternate' && tag.hreflang);

      // Extract favicon
      const favicon = linkTags.find(tag => 
        tag.rel === 'icon' || tag.rel === 'shortcut icon' || tag.rel === 'apple-touch-icon'
      );

      // Create response object
      const analysisData = {
        url,
        title,
        metaTags: {
          description,
          viewport,
          robots,
          canonical,
        },
        socialTags: {
          openGraph: ogTags,
          twitter: twitterTags
        },
        linkTags: {
          hreflang,
          favicon
        },
        allMetaTags: metaTags,
        allLinkTags: linkTags
      };

      // Save the analysis result
      const timestamp = new Date().toISOString();
      const seoResult = await storage.createSeoResult({
        url,
        title,
        description: description ? description.content : null,
        score: 0, // We would calculate this based on the analysis
        analysis_data: JSON.stringify(analysisData),
        created_at: timestamp
      });

      return res.status(200).json(analysisData);
    } catch (error) {
      console.error("Error analyzing URL:", error);
      return res.status(500).json({ 
        message: "An error occurred while analyzing the URL",
        error: error.message 
      });
    }
  });

  // Get recent analyses
  app.get("/api/recent", async (req, res) => {
    try {
      const recentResults = await storage.getRecentSeoResults(5);
      return res.status(200).json(recentResults);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to fetch recent analyses",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
