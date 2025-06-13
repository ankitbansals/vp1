// Brand types based on BigCommerce channel or brand ID
export type BrandId = 'vinod-patel' | 'home-living' | 'neutral' | 'default';

// Brand theme configuration
export type ThemeColors = {
  '--background': string;
  '--foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--accent': string;
  '--accent-foreground': string;
  '--border': string;
  '--input': string;
  '--ring': string;
};

export const brandThemes: Record<BrandId, ThemeColors> = {
  'vinod-patel': {
    '--background': '0 0% 100%',
    '--foreground': '240 10% 3.9%',
    '--primary': '240 5.9% 10%',
    '--primary-foreground': '0 0% 98%',
    '--secondary': '240 4.8% 95.9%',
    '--secondary-foreground': '240 5.9% 10%',
    '--muted': '240 4.8% 95.9%',
    '--muted-foreground': '240 3.8% 46.1%',
    '--accent': '240 4.8% 95.9%',
    '--accent-foreground': '240 5.9% 10%',
    '--border': '240 5.9% 90%',
    '--input': '240 5.9% 90%',
    '--ring': '240 5.9% 10%',
  },
  'neutral': {
    '--background': '0 0% 100%',
    '--foreground': '240 10% 3.9%',
    '--primary': '240 5.2% 26.1%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '240 4.8% 95.9%',
    '--secondary-foreground': '240 5.9% 10%',
    '--muted': '240 4.8% 95.9%',
    '--muted-foreground': '240 3.8% 46.1%',
    '--accent': '240 4.8% 95.9%',
    '--accent-foreground': '240 5.9% 10%',
    '--border': '240 5.9% 90%',
    '--input': '240 5.9% 90%',
    '--ring': '240 5.2% 26.1%',
  },
  'home-living': {
    '--background': '0 0% 100%',
    '--foreground': '0 0% 13.3%',
    '--primary': '24 100% 50%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '0 0% 96.1%',
    '--secondary-foreground': '0 0% 13.3%',
    '--muted': '0 0% 96.1%',
    '--muted-foreground': '0 0% 45.1%',
    '--accent': '0 0% 96.1%',
    '--accent-foreground': '0 0% 13.3%',
    '--border': '0 0% 89.8%',
    '--input': '0 0% 89.8%',
    '--ring': '24 100% 50%',
  },
  'default': {
    '--background': '0 0% 100%',
    '--foreground': '222.2 47.4% 11.2%',
    '--primary': '221.2 83.2% 53.3%',
    '--primary-foreground': '210 40% 98%',
    '--secondary': '210 40% 96.1%',
    '--secondary-foreground': '222.2 47.4% 11.2%',
    '--muted': '210 40% 96.1%',
    '--muted-foreground': '215.4 16.3% 46.9%',
    '--accent': '210 40% 96.1%',
    '--accent-foreground': '222.2 47.4% 11.2%',
    '--border': '214.3 31.8% 91.4%',
    '--input': '214.3 31.8% 91.4%',
    '--ring': '221.2 83.2% 53.3%',
  },
};

// Helper to get brand ID from URL
export function getBrandIdFromContext(): BrandId {
  if (typeof window === 'undefined') return 'default';
  
  const path = window.location.pathname.toLowerCase();
  
  // Check for home & living variations
  if (path.includes('home-living') || path.includes('home') || path.includes('living') || path.includes('hl')) {
    return 'home-living';
  }
  
  // Check for vinod patel variations
  if (path.includes('vinod-patel') || path.includes('vinod') || path.includes('vpg') || path.includes('vp')) {
    return 'vinod-patel';
  }
  
  // Default to vinod-patel
  return 'vinod-patel';
}
