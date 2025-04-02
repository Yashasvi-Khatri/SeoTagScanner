/**
 * Truncates a string to a specified length and adds ellipsis if needed
 * @param {string} str - The string to truncate
 * @param {number} length - The maximum length
 * @returns {string} - The truncated string
 */
export function truncateString(str, length) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length - 3) + '...';
}

/**
 * Formats a tag for display
 * @param {string} tag - The HTML tag
 * @returns {string} - The formatted tag
 */
export function formatTagForDisplay(tag) {
  if (!tag) return '';
  // Replace angle brackets with their HTML entities to display in the UI
  return tag.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Checks if a URL is valid
 * @param {string} url - The URL to check
 * @returns {boolean} - Whether the URL is valid
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Determines the status of a tag based on its presence and content
 * @param {string} tagName - The name of the tag
 * @param {object} tagContent - The tag content object
 * @param {object} criteria - Criteria for evaluation
 * @returns {string} - The status (Optimal, Needs Improvement, Missing)
 */
export function getTagStatus(tagName, tagContent, criteria = {}) {
  if (!tagContent) return 'Missing';
  
  switch (tagName) {
    case 'title':
      return (tagContent.length > 10 && tagContent.length < 60) ? 'Optimal' : 'Needs Improvement';
    case 'description':
      return (tagContent.content.length > 120 && tagContent.content.length < 158) ? 'Optimal' : 'Needs Improvement';
    case 'og:title':
    case 'og:description':
    case 'twitter:title':
    case 'twitter:description':
      return tagContent.content.length > 10 ? 'Optimal' : 'Needs Improvement';
    case 'og:image':
    case 'twitter:image':
      return tagContent.content && tagContent.content.startsWith('http') ? 'Optimal' : 'Needs Improvement';
    default:
      return 'Optimal';
  }
}

/**
 * Gets a recommendation for a tag based on its status
 * @param {string} tagName - The name of the tag
 * @param {string} status - The tag status
 * @param {object} tagContent - The tag content
 * @returns {string} - The recommendation
 */
export function getTagRecommendation(tagName, status, tagContent) {
  if (status === 'Missing') {
    switch (tagName) {
      case 'title':
        return 'Missing title tag. Add a descriptive title between 50-60 characters.';
      case 'description':
        return 'Missing meta description. Add a compelling description between 120-158 characters.';
      case 'viewport':
        return 'Missing viewport meta tag. This is important for mobile optimization.';
      case 'canonical':
        return 'Missing canonical URL tag. This helps prevent duplicate content issues.';
      case 'robots':
        return 'Missing robots meta tag. This helps control how search engines crawl and index your page.';
      case 'hreflang':
        return 'Missing hreflang tags. These are important if your site has multilingual content.';
      default:
        return `Missing ${tagName} tag.`;
    }
  }
  
  if (status === 'Needs Improvement') {
    switch (tagName) {
      case 'title':
        return `Title length (${tagContent.length} characters) is ${tagContent.length < 50 ? 'too short' : 'too long'}. Aim for 50-60 characters.`;
      case 'description':
        return `Description length (${tagContent.content.length} characters) is ${tagContent.content.length < 120 ? 'too short' : 'too long'}. Aim for 120-158 characters.`;
      default:
        return `${tagName} tag could be improved.`;
    }
  }
  
  return `${tagName} tag is properly implemented.`;
}
