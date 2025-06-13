'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { getBrandFromUrl, getThemeCss } from './themeProcessor';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Get brand from URL and generate theme CSS
  const themeCss = useMemo(() => {
    const brand = getBrandFromUrl(pathname);
    return getThemeCss(brand);
  }, [pathname]);

  // Apply theme CSS variables
  useEffect(() => {
    // Remove any existing style elements
    document.querySelectorAll('style[data-theme]').forEach(el => el.remove());
    
    // Create new style element with current theme
    const style = document.createElement('style');
    style.setAttribute('data-theme', 'custom-theme');
    style.textContent = themeCss;
    
    // Add to document head
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [themeCss]);

  return <>{children}</>;
}
