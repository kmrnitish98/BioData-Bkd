/**
 * Utility functions for image optimization
 */

/**
 * Optimizes a Cloudinary image URL by injecting transformation parameters.
 * Forces automatic format selection (WebP/AVIF), automatic quality, and scales to the specified width.
 * 
 * @param {string} url - The original Cloudinary URL
 * @param {number} width - The desired width in pixels
 * @returns {string} - The optimized Cloudinary URL
 */
export const optimizeImage = (url, width = 800) => {
  if (!url || typeof url !== 'string') return url;
  
  // Only intercept Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;
  
  // If transformations are already applied, don't double apply
  if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
    return url;
  }

  // Inject transformations right after '/upload/'
  const transformations = `f_auto,q_auto,w_${width},c_fill`;
  return url.replace('/upload/', `/upload/${transformations}/`);
};
