// Define brand name type
type BrandName = 'vinod-patel' | 'home-living' | 'neutral';

/**
 * Brand mapping configuration
 * Maps various URL patterns to their corresponding brand names
 */
const brandMap = {
  // Vinod Patel variations
  'vinod-patel': 'vinod-patel' as const,
  'vinodpatel': 'vinod-patel' as const,
  'vp': 'vinod-patel' as const,
  'vpg': 'vinod-patel' as const,
  'vinod': 'vinod-patel' as const,
  
  // Home & Living variations
  'home': 'home-living' as const,
  'home-living': 'home-living' as const,
  'living': 'home-living' as const,
  'hl': 'home-living' as const,
  
  // Neutral theme
  'neutral': 'neutral' as const
} as const;

type BrandMapKey = keyof typeof brandMap;

/**
 * Type guard to check if a string is a valid brand map key
 */
function isBrandMapKey(key: string): key is BrandMapKey {
  return key in brandMap;
}

/**
 * Gets the brand name from a string value
 * @param value The value to convert to a brand name
 * @returns The normalized brand name or 'vinod-patel' as default
 */
function getBrandName(value: string | undefined | null): BrandName {
  if (!value) return 'vinod-patel';
  const normalized = value.toLowerCase().trim();
  return (isBrandMapKey(normalized) && brandMap[normalized]) || 'vinod-patel';
}

/**
 * Extracts brand name from URL path
 * @param url The URL to extract brand from
 * @returns The detected brand name
 */
export function getBrandFromUrl(url: string | undefined | null): BrandName {
  try {
    if (!url) return 'vinod-patel';
    
    // Handle relative/absolute URLs
    const baseUrl = url.startsWith('/') ? 'http://example.com' : 'http://example.com/';
    const urlObj = new URL(url, baseUrl);
    const pathname = urlObj.pathname;
    
    // Get the first path segment after any leading slashes
    const segments = pathname.split('/').filter(Boolean);
    const brandSegment = segments[0] || 'vinod-patel';
    
    return getBrandName(brandSegment);
  } catch (error) {
    console.error('Error determining brand from URL:', error);
    return 'vinod-patel';
  }
}

/**
 * Gets the CSS for a specific brand theme
 * @param brand The brand name
 * @returns CSS string with theme variables
 */
export function getThemeCss(brand: BrandName = 'vinod-patel'): string {
  const brandName = brand || 'vinod-patel';
  return `/* ${brandName} theme */
:root, [data-brand='${brandName}'] {
  /* Generated from ${brandName}.css */
  --brand: ${brandName};
}

/* Import brand-specific styles */
@import '/core/theme/themes/${brandName}.css';
`;
}

/**
 * Gets the current theme CSS based on URL path
 * @param pathname The URL path to detect brand from
 * @returns CSS string with theme variables
 */
export function getCurrentThemeCss(pathname: string = '/'): string {
  const brand = getBrandFromUrl(pathname);
  return getThemeCss(brand);
}

/**
 * Gets the current brand from URL path
 * @param pathname The URL path to detect brand from
 * @returns The detected brand name
 */
export function getCurrentBrand(pathname: string = '/'): BrandName {
  return getBrandFromUrl(pathname);
}

/**
 * Gets the default brand name
 * @returns The default brand name
 */
export function getDefaultBrand(): BrandName {
  return 'vinod-patel';
}

// Export BrandName type
export type { BrandName };
