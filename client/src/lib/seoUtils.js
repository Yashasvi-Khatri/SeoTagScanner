// Utility functions for SEO analysis

// Score calculation constants
const MAX_TITLE_LENGTH = 60;
const MIN_TITLE_LENGTH = 30;
const MAX_DESCRIPTION_LENGTH = 160;
const MIN_DESCRIPTION_LENGTH = 70;

// Essential tags to look for
export const ESSENTIAL_TAGS = [
  { name: "title", selector: "title", required: true },
  { name: "description", selector: "meta[name='description']", attribute: "content", required: true },
  { name: "viewport", selector: "meta[name='viewport']", attribute: "content", required: true },
  { name: "canonical", selector: "link[rel='canonical']", attribute: "href", required: true },
  { name: "robots", selector: "meta[name='robots']", attribute: "content", required: false },
];

// Social media tags to look for
export const SOCIAL_TAGS = [
  // OpenGraph
  { name: "og:title", selector: "meta[property='og:title']", attribute: "content", type: "opengraph", required: true },
  { name: "og:description", selector: "meta[property='og:description']", attribute: "content", type: "opengraph", required: true },
  { name: "og:image", selector: "meta[property='og:image']", attribute: "content", type: "opengraph", required: true },
  { name: "og:url", selector: "meta[property='og:url']", attribute: "content", type: "opengraph", required: true },
  { name: "og:type", selector: "meta[property='og:type']", attribute: "content", type: "opengraph", required: false },
  
  // Twitter
  { name: "twitter:card", selector: "meta[name='twitter:card']", attribute: "content", type: "twitter", required: true },
  { name: "twitter:title", selector: "meta[name='twitter:title']", attribute: "content", type: "twitter", required: false },
  { name: "twitter:description", selector: "meta[name='twitter:description']", attribute: "content", type: "twitter", required: false },
  { name: "twitter:image", selector: "meta[name='twitter:image']", attribute: "content", type: "twitter", required: false },
];

// Analyze title
export function analyzeTitle(title) {
  if (!title) {
    return {
      status: "error",
      message: "Missing title tag",
      score: 0
    };
  }
  
  const length = title.length;
  
  if (length > MAX_TITLE_LENGTH) {
    return {
      status: "error",
      message: `Too long at ${length} characters (max ${MAX_TITLE_LENGTH})`,
      score: 50
    };
  }
  
  if (length < MIN_TITLE_LENGTH) {
    return {
      status: "warning",
      message: `Could be more descriptive (${length}/${MIN_TITLE_LENGTH}-${MAX_TITLE_LENGTH})`,
      score: 70
    };
  }
  
  return {
    status: "good",
    message: `Optimal length (${length}/${MAX_TITLE_LENGTH})`,
    score: 100
  };
}

// Analyze description
export function analyzeDescription(description) {
  if (!description) {
    return {
      status: "error",
      message: "Missing description meta tag",
      score: 0
    };
  }
  
  const length = description.length;
  
  if (length > MAX_DESCRIPTION_LENGTH) {
    return {
      status: "warning",
      message: `Too long at ${length} characters (max ${MAX_DESCRIPTION_LENGTH})`,
      score: 70
    };
  }
  
  if (length < MIN_DESCRIPTION_LENGTH) {
    return {
      status: "warning",
      message: `Could be more descriptive (${length}/${MIN_DESCRIPTION_LENGTH}-${MAX_DESCRIPTION_LENGTH})`,
      score: 80
    };
  }
  
  return {
    status: "good",
    message: `Optimal length (${length}/${MAX_DESCRIPTION_LENGTH})`,
    score: 100
  };
}

// Analyze canonical URL
export function analyzeCanonical(canonical, currentUrl) {
  if (!canonical) {
    return {
      status: "error",
      message: "Missing canonical URL",
      code: `<link rel="canonical" href="${currentUrl}">`,
      score: 0
    };
  }
  
  // Check if canonical URL matches current URL (ignoring trailing slashes)
  const normalizedCanonical = canonical.replace(/\/$/, "");
  const normalizedCurrentUrl = currentUrl.replace(/\/$/, "");
  
  if (normalizedCanonical !== normalizedCurrentUrl) {
    return {
      status: "warning",
      message: "Canonical URL doesn't match the current URL",
      code: canonical,
      score: 50
    };
  }
  
  return {
    status: "good",
    message: "Canonical URL is properly implemented",
    code: canonical,
    score: 100
  };
}

// Generate overall SEO score
export function calculateOverallScore(scores) {
  if (scores.length === 0) return 0;
  
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  return Math.round(totalScore / scores.length);
}

// Generate recommendations based on analysis
export function generateRecommendations(analysis) {
  const recommendations = [];
  
  // Check essential tags
  analysis.essentialTags.forEach(tag => {
    if (tag.status === "error") {
      recommendations.push({
        title: `Add missing ${tag.name} tag`,
        subtitle: `Critical for SEO performance`,
        description: `The ${tag.name} tag is missing, which is essential for proper SEO. ${getTagDescription(tag.name)}`,
        code: tag.recommendedCode || "",
        priority: "high",
        learnMoreUrl: getLearnMoreUrl(tag.name)
      });
    } else if (tag.status === "warning") {
      recommendations.push({
        title: `Improve ${tag.name} tag`,
        subtitle: `Enhance SEO effectiveness`,
        description: tag.message,
        code: tag.code,
        priority: "medium",
        learnMoreUrl: getLearnMoreUrl(tag.name)
      });
    }
  });
  
  // Check social tags
  const missingTwitter = analysis.socialTags.filter(tag => 
    tag.type === "twitter" && tag.status === "error" && tag.required
  );
  
  const missingOG = analysis.socialTags.filter(tag => 
    tag.type === "opengraph" && tag.status === "error" && tag.required
  );
  
  if (missingTwitter.length > 0) {
    let twitterCode = missingTwitter.map(tag => tag.recommendedCode).join("\n");
    recommendations.push({
      title: "Add Twitter Card meta tags",
      subtitle: "Enhance Twitter link previews",
      description: "Twitter Card meta tags are missing, which means your content won't display rich previews when shared on Twitter. Add these tags to improve engagement.",
      code: twitterCode,
      priority: "medium",
      learnMoreUrl: "https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards"
    });
  }
  
  if (missingOG.length > 0) {
    let ogCode = missingOG.map(tag => tag.recommendedCode).join("\n");
    recommendations.push({
      title: "Add Open Graph meta tags",
      subtitle: "Improve social media sharing",
      description: "Open Graph meta tags are missing, which means your content won't display rich previews when shared on social platforms like Facebook and LinkedIn. Add these tags to improve engagement.",
      code: ogCode,
      priority: "medium",
      learnMoreUrl: "https://ogp.me/"
    });
  }
  
  return recommendations;
}

// Helper function to get description for each tag type
function getTagDescription(tagName) {
  switch (tagName) {
    case "title":
      return "The title tag is crucial for SEO as it tells search engines and users what your page is about. Aim for 50-60 characters.";
    case "description":
      return "The meta description provides a summary of the page content and is often displayed in search results. Aim for 150-160 characters.";
    case "viewport":
      return "The viewport meta tag is essential for responsive design. This tag tells browsers how to control the page's dimensions and scaling on different devices.";
    case "canonical":
      return "The canonical tag helps prevent duplicate content issues by specifying the preferred URL for a page.";
    case "robots":
      return "The robots meta tag tells search engines how to crawl and index your page.";
    default:
      return "";
  }
}

// Helper function to get learn more URLs
function getLearnMoreUrl(tagName) {
  switch (tagName) {
    case "title":
      return "https://moz.com/learn/seo/title-tag";
    case "description":
      return "https://moz.com/learn/seo/meta-description";
    case "viewport":
      return "https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag";
    case "canonical":
      return "https://moz.com/learn/seo/canonicalization";
    case "robots":
      return "https://developers.google.com/search/docs/advanced/robots/robots_meta_tag";
    default:
      return "";
  }
}
