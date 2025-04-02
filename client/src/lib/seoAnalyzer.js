/**
 * Analyzes the SEO data and returns a score and counts of passed, warning, and error items
 * @param {Object} analysisData - The SEO analysis data
 * @returns {Object} - Score and counts
 */
export function analyzeSeoScore(analysisData) {
  let score = 0;
  let passed = 0;
  let warnings = 0;
  let errors = 0;
  
  // Check for essential meta tags
  // Title
  if (analysisData.title) {
    if (analysisData.title.length > 10 && analysisData.title.length < 60) {
      score += 15;
      passed++;
    } else {
      score += 5;
      warnings++;
    }
  } else {
    errors++;
  }
  
  // Meta description
  if (analysisData.metaTags.description) {
    const descLength = analysisData.metaTags.description.content.length;
    if (descLength > 120 && descLength < 158) {
      score += 15;
      passed++;
    } else {
      score += 5;
      warnings++;
    }
  } else {
    errors++;
  }
  
  // Canonical
  if (analysisData.metaTags.canonical) {
    score += 10;
    passed++;
  } else {
    warnings++;
  }
  
  // Viewport
  if (analysisData.metaTags.viewport) {
    score += 10;
    passed++;
  } else {
    errors++;
  }
  
  // Check for Open Graph tags
  const ogTags = analysisData.socialTags.openGraph;
  if (ogTags.length > 0) {
    const hasOgTitle = ogTags.some(tag => tag.property === 'og:title');
    const hasOgDesc = ogTags.some(tag => tag.property === 'og:description');
    const hasOgImage = ogTags.some(tag => tag.property === 'og:image');
    
    if (hasOgTitle) {
      score += 5;
      passed++;
    } else {
      warnings++;
    }
    
    if (hasOgDesc) {
      score += 5;
      passed++;
    } else {
      warnings++;
    }
    
    if (hasOgImage) {
      score += 5;
      passed++;
    } else {
      warnings++;
    }
  } else {
    errors++;
  }
  
  // Check for Twitter Card tags
  const twitterTags = analysisData.socialTags.twitter;
  if (twitterTags.length > 0) {
    const hasTwitterTitle = twitterTags.some(tag => tag.name === 'twitter:title');
    const hasTwitterDesc = twitterTags.some(tag => tag.name === 'twitter:description');
    const hasTwitterImage = twitterTags.some(tag => tag.name === 'twitter:image');
    
    if (hasTwitterTitle) {
      score += 5;
      passed++;
    } else {
      warnings++;
    }
    
    if (hasTwitterDesc) {
      score += 5;
      passed++;
    } else {
      warnings++;
    }
    
    if (hasTwitterImage) {
      score += 5;
      passed++;
    } else {
      warnings++;
    }
  } else {
    errors++;
  }
  
  // Check for robots meta
  if (analysisData.metaTags.robots) {
    score += 10;
    passed++;
  } else {
    warnings++;
  }
  
  // Check for hreflang tags
  if (analysisData.linkTags.hreflang && analysisData.linkTags.hreflang.length > 0) {
    score += 10;
    passed++;
  } else {
    // Not a critical error, just a warning
    warnings++;
  }
  
  // Ensure the score is within 0-100 range
  score = Math.min(100, Math.max(0, score));
  
  return {
    score,
    passed,
    warnings,
    errors
  };
}

/**
 * Generates recommendations based on the analysis data
 * @param {Object} analysisData - The SEO analysis data
 * @returns {Array} - Array of recommendation objects
 */
export function getRecommendations(analysisData) {
  const recommendations = [];
  
  // Title recommendations
  if (!analysisData.title) {
    recommendations.push({
      type: 'error',
      title: 'Add Title Tag',
      description: 'Missing page title. Add a descriptive title tag between 50-60 characters.'
    });
  } else if (analysisData.title.length < 10) {
    recommendations.push({
      type: 'warning',
      title: 'Improve Title Tag',
      description: `Your title is too short (${analysisData.title.length} characters). Aim for 50-60 characters.`
    });
  } else if (analysisData.title.length > 60) {
    recommendations.push({
      type: 'warning',
      title: 'Shorten Title Tag',
      description: `Your title is too long (${analysisData.title.length} characters). Keep it under 60 characters to avoid truncation in search results.`
    });
  }
  
  // Description recommendations
  if (!analysisData.metaTags.description) {
    recommendations.push({
      type: 'error',
      title: 'Add Meta Description',
      description: 'Missing meta description. Add a compelling description between 120-158 characters.'
    });
  } else {
    const descLength = analysisData.metaTags.description.content.length;
    if (descLength < 120) {
      recommendations.push({
        type: 'warning',
        title: 'Improve Meta Description',
        description: `Your meta description is too short (${descLength} characters). Aim for 120-158 characters to improve CTR.`
      });
    } else if (descLength > 158) {
      recommendations.push({
        type: 'warning',
        title: 'Shorten Meta Description',
        description: `Your meta description is too long (${descLength} characters). Keep it under 158 characters to avoid truncation in search results.`
      });
    }
  }
  
  // Viewport recommendation
  if (!analysisData.metaTags.viewport) {
    recommendations.push({
      type: 'error',
      title: 'Add Viewport Meta Tag',
      description: 'Missing viewport meta tag affects mobile optimization and search ranking.'
    });
  }
  
  // Canonical recommendation
  if (!analysisData.metaTags.canonical) {
    recommendations.push({
      type: 'warning',
      title: 'Add Canonical URL Tag',
      description: 'Missing canonical URL tag. This helps prevent duplicate content issues.'
    });
  }
  
  // Social media recommendations
  const ogTags = analysisData.socialTags.openGraph;
  const twitterTags = analysisData.socialTags.twitter;
  
  if (ogTags.length === 0) {
    recommendations.push({
      type: 'error',
      title: 'Add Open Graph Tags',
      description: 'Missing Open Graph tags. These improve how your content appears when shared on Facebook and other platforms.'
    });
  } else {
    const hasOgTitle = ogTags.some(tag => tag.property === 'og:title');
    const hasOgDesc = ogTags.some(tag => tag.property === 'og:description');
    const hasOgImage = ogTags.some(tag => tag.property === 'og:image');
    
    if (!hasOgTitle || !hasOgDesc || !hasOgImage) {
      recommendations.push({
        type: 'warning',
        title: 'Complete Open Graph Tags',
        description: 'Some Open Graph tags are missing. Ensure you have og:title, og:description, and og:image for better social sharing.'
      });
    }
  }
  
  if (twitterTags.length === 0) {
    recommendations.push({
      type: 'warning',
      title: 'Add Twitter Card Tags',
      description: 'Missing Twitter Card tags. These improve how your content appears when shared on Twitter.'
    });
  }
  
  // Robots recommendation
  if (!analysisData.metaTags.robots) {
    recommendations.push({
      type: 'warning',
      title: 'Add Robots Meta Tag',
      description: 'Missing robots meta tag. This helps control how search engines crawl and index your page.'
    });
  }
  
  // Hreflang recommendation
  if (!analysisData.linkTags.hreflang || analysisData.linkTags.hreflang.length === 0) {
    recommendations.push({
      type: 'warning',
      title: 'Consider Adding Hreflang Tags',
      description: 'If your site serves different languages, add hreflang tags to help search engines serve the correct version.'
    });
  }
  
  // If everything looks good
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'success',
      title: 'Great SEO Implementation',
      description: 'Your page has all the essential SEO tags properly implemented.'
    });
  }
  
  return recommendations;
}
