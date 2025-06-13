'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { getCurrentBrand, getThemeCss, type BrandName } from './themeProcessor';

type BrandThemeProviderState = {
  brandId: BrandName;
  theme: string; // CSS string
};

type BrandThemeProviderProps = {
  children: React.ReactNode;
  initialBrandId?: BrandName;
  serverBrandId?: BrandName;
};

const initialState: BrandThemeProviderState = {
  brandId: 'vinod-patel',
  theme: '',
};

export const BrandThemeContext = createContext<BrandThemeProviderState>(initialState);

export const BrandThemeProvider: React.FC<BrandThemeProviderProps> = ({
  children,
  initialBrandId,
  serverBrandId,
}) => {
  const pathname = usePathname();
  
  // Get the current brand from URL or props
  const brandId = useMemo<BrandName>(() => {
    if (serverBrandId) return serverBrandId;
    if (initialBrandId) return initialBrandId;
    return getCurrentBrand(pathname || (typeof window !== 'undefined' ? window.location.pathname : ''));
  }, [pathname, initialBrandId, serverBrandId]);

  // Get the theme CSS for the current brand
  const themeCss = useMemo(() => {
    return getThemeCss(brandId);
  }, [brandId]);

  // Apply theme CSS to document head and update HTML attributes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const html = document.documentElement;
    
    // Update HTML classes
    html.classList.remove(...html.classList);
    html.classList.add('theme-' + brandId);
    html.setAttribute('data-theme', brandId);
    
    // Remove any existing theme style
    const existingStyle = document.getElementById('theme-style');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    
    // Add new theme style
    const style = document.createElement('style');
    style.id = 'theme-style';
    style.textContent = themeCss;
    document.head.appendChild(style);
    
    // Set data-brand and data-theme attributes on html element
    html.setAttribute('data-brand', brandId);
    
    // Add theme-specific classes to body
    document.body.classList.add('theme-' + brandId);
    
    return () => {
      // Clean up when component unmounts
      if (style.parentNode === document.head) {
        document.head.removeChild(style);
      }
      html.removeAttribute('data-brand');
      html.removeAttribute('data-theme');
      document.body.classList.remove('theme-' + brandId);
    };
  }, [themeCss, brandId]);

  const value = useMemo<BrandThemeProviderState>(
    () => ({
      brandId,
      theme: themeCss,
    }),
    [brandId, themeCss],
  );
  
  // Handle route changes for client-side navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleRouteChange = () => {
      const newBrand = getCurrentBrand(window.location.pathname);
      if (newBrand !== brandId) {
        // Force a re-render with the new brand
        window.dispatchEvent(new Event('brandChange'));
      }
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [brandId]);

  return (
    <BrandThemeContext.Provider value={value}>
      {children}
    </BrandThemeContext.Provider>
  );
};

export const useBrandTheme = () => {
  const context = useContext(BrandThemeContext);
  if (context === undefined) {
    throw new Error('useBrandTheme must be used within a BrandThemeProvider');
  }
  return context;
};
