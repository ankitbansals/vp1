import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBrandFromPathname(pathname: string): string {
  const brand = pathname.split('/')[1]?.toLowerCase() || 'vinod-patel';
  return ['vinod-patel', 'home-living', 'neutral', 'default'].includes(brand) 
    ? brand 
    : 'vinod-patel';
}

export function getBrandConfig(brand: string) {
  const brands = {
    'vinod-patel': {
      name: 'Vinod Patel',
      slug: 'vinod-patel',
      primaryColor: 'hsl(var(--primary))',
    },  
    'home-living': {
      name: 'Home & Living',
      slug: 'home-living',
      primaryColor: 'hsl(var(--primary))',
    },
    'neutral': {
      name: 'Neutral',
      slug: 'neutral',
      primaryColor: 'hsl(var(--primary))',
    },
  };

  return brands[brand as keyof typeof brands] || brands['vinod-patel'];
}
