'client';

import { useContext } from 'react';
import { BrandThemeContext } from './theme-provider';

/**
 * Hook to access the current theme and brand information
 * @returns Object containing the current brand ID and theme CSS
 * @example
 * const { brandId, theme } = useTheme();
 */
export const useTheme = () => {
  const context = useContext(BrandThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a BrandThemeProvider');
  }
  return context;
};

/**
 * Hook to get the current brand name
 * @returns The current brand name
 * @example
 * const brand = useBrand();
 */
export const useBrand = (): string => {
  const { brandId } = useTheme();
  return brandId;
};

/**
 * Hook to get Tailwind classes for a specific brand
 * @param classes Object mapping brand names to Tailwind class strings
 * @returns The Tailwind classes for the current brand
 * @example
 * const buttonClasses = useBrandClasses({
 *   'vinod-patel': 'bg-orange-500 text-white',
 *   'home-living': 'bg-green-600 text-white',
 *   'neutral': 'bg-gray-700 text-white'
 * });
 */
export const useBrandClasses = <T extends Record<string, string>>(classes: T): string => {
  const brand = useBrand();
  return classes[brand] || '';
};
