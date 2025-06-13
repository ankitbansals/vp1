'use client';

import { SubmissionResult, useForm } from '@conform-to/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import debounce from 'lodash.debounce';
import { ArrowRight, ChevronDown, Search, SearchIcon } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {brandLogos} from  '~/data/brandLogos'
import React, {
  forwardRef,
  Ref,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { useFormStatus } from 'react-dom';

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Button } from '@/vibes/soul/primitives/button';
import { Logo } from '@/vibes/soul/primitives/logo';
import { Price } from '@/vibes/soul/primitives/price-label';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import { Link } from '~/components/link';

// Default values for top header
const DEFAULT_SHOP_AT_TEXT = 'Shop at';
const DEFAULT_SHOP_AT_LINK = 'VPG Store';

interface Link {
  label: string;
  href: string;
  groups?: Array<{
    label?: string;
    href?: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
}

interface Locale {
  id: string;
  label: string;
}

interface Currency {
  id: string;
  label: string;
}

type Action<State, Payload> = (
  state: Awaited<State>,
  payload: Awaited<Payload>,
) => State | Promise<State>;

export type SearchResult =
  | {
      type: 'products';
      title: string;
      products: Array<{
        id: string;
        title: string;
        href: string;
        price?: Price;
        image?: { src: string; alt: string };
      }>;
    }
  | {
      type: 'links';
      title: string;
      links: Array<{ label: string; href: string }>;
    };

type CurrencyAction = Action<SubmissionResult | null, FormData>;
type SearchAction<S extends SearchResult> = Action<
  {
    searchResults: S[] | null;
    lastResult: SubmissionResult | null;
    emptyStateTitle?: string;
    emptyStateSubtitle?: string;
  },
  FormData
>;

interface Props<S extends SearchResult> {
  className?: string;
  isFloating?: boolean;
  accountHref: string;
  cartCount?: Streamable<number | null>;
  cartHref: string;
  links: Streamable<Link[]>;
  linksPosition?: 'center' | 'left' | 'right';
  locales?: Locale[];
  activeLocaleId?: string;
  currencies?: Currency[];
  activeCurrencyId?: string;
  currencyAction?: CurrencyAction;
  logo?: Streamable<string | { src: string; alt: string } | null>;
  logoWidth?: number;
  logoHeight?: number;
  logoHref?: string;
  logoLabel?: string;
  mobileLogo?: Streamable<string | { src: string; alt: string } | null>;
  mobileLogoWidth?: number;
  mobileLogoHeight?: number;
  searchHref: string;
  searchParamName?: string;
  searchAction?: SearchAction<S>;
  searchCtaLabel?: string;
  searchInputPlaceholder?: string;
  cartLabel?: string;
  accountLabel?: string;
  openSearchPopupLabel?: string;
  searchLabel?: string;
  mobileMenuTriggerLabel?: string;
  // Top header props
  shopAtText?: string;
  shopAtLink?: string;
}

const navGroupClassName =
  'block rounded-lg bg-[var(--nav-group-background,transparent)] px-3 py-2 font-[family-name:var(--nav-group-font-family,var(--font-family-body))] font-medium text-[var(--nav-group-text,hsl(var(--foreground)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors hover:bg-[var(--nav-group-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-group-text-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2 @xs:px-2 @xs:py-1.5 @xs:text-sm';

const navButtonClassName =
  'relative rounded-lg bg-[var(--nav-button-background,transparent)] p-1.5 text-[var(--nav-button-icon,hsl(var(--foreground)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors focus-visible:outline-0 focus-visible:ring-2 hover:bg-[var(--nav-button-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-button-icon-hover,hsl(var(--foreground)))] @xs:p-1';

const navLinkClassName =
  'block rounded-lg bg-[var(--nav-link-background,transparent)] px-3 py-2 font-[family-name:var(--nav-link-font-family,var(--font-family-body))] text-sm font-medium text-[var(--nav-link-text,hsl(var(--foreground)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors hover:bg-[var(--nav-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-link-text-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2 @xs:px-2 @xs:py-1.5 @xs:text-xs';

const mobileNavLinkClassName =
  'flex items-center gap-4 py-3 text-base font-medium text-[var(--nav-mobile-link-text,hsl(var(--foreground)))] transition-colors hover:text-[var(--nav-mobile-link-text-hover,hsl(var(--primary)))] @xs:py-2 @xs:text-sm';

const mobileNavButtonClassName =
  'flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--nav-mobile-button-background,transparent)] text-[var(--nav-mobile-button-icon,hsl(var(--foreground)))] transition-colors hover:bg-[var(--nav-mobile-button-background-hover,hsl(var(--contrast-100)))] @xs:h-10 @xs:w-10';

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --nav-focus: hsl(var(--primary));
 *   --nav-background: hsl(var(--background));
 *   --nav-floating-border: hsl(var(--foreground) / 10%);
 *   --nav-link-text: hsl(var(--foreground));
 *   --nav-link-text-hover: hsl(var(--foreground));
 *   --nav-link-background: transparent;
 *   --nav-link-background-hover: hsl(var(--contrast-100));
 *   --nav-link-font-family: var(--font-family-body);
 *   --nav-group-text: hsl(var(--foreground));
 *   --nav-group-text-hover: hsl(var(--foreground));
 *   --nav-group-background: transparent;
 *   --nav-group-background-hover: hsl(var(--contrast-100));
 *   --nav-group-font-family: var(--font-family-body);
 *   --nav-sub-link-text: hsl(var(--contrast-500));
 *   --nav-sub-link-text-hover: hsl(var(--foreground));
 *   --nav-sub-link-background: transparent;
 *   --nav-sub-link-background-hover: hsl(var(--contrast-100));
 *   --nav-sub-link-font-family: var(--font-family-body);
 *   --nav-button-icon: hsl(var(--foreground));
 *   --nav-button-icon-hover: hsl(var(--foreground));
 *   --nav-button-background: hsl(var(--background));
 *   --nav-button-background-hover: hsl(var(--contrast-100));
 *   --nav-menu-background: hsl(var(--background));
 *   --nav-menu-border: hsl(var(--foreground) / 5%);
 *   --nav-mobile-background: hsl(var(--background));
 *   --nav-mobile-divider: hsl(var(--contrast-100));
 *   --nav-mobile-button-icon: hsl(var(--foreground));
 *   --nav-mobile-link-text: hsl(var(--foreground));
 *   --nav-mobile-link-text-hover: hsl(var(--foreground));
 *   --nav-mobile-link-background: transparent;
 *   --nav-mobile-link-background-hover: hsl(var(--contrast-100));
 *   --nav-mobile-link-font-family: var(--font-family-body);
 *   --nav-mobile-sub-link-text: hsl(var(--contrast-500));
 *   --nav-mobile-sub-link-text-hover: hsl(var(--foreground));
 *   --nav-mobile-sub-link-background: transparent;
 *   --nav-mobile-sub-link-background-hover: hsl(var(--contrast-100));
 *   --nav-mobile-sub-link-font-family: var(--font-family-body);
 *   --nav-search-background: hsl(var(--background));
 *   --nav-search-border: hsl(var(--foreground) / 5%);
 *   --nav-search-divider: hsl(var(--foreground) / 5%);
 *   --nav-search-icon: hsl(var(--contrast-500));
 *   --nav-search-empty-title: hsl(var(--foreground));
 *   --nav-search-empty-subtitle: hsl(var(--contrast-500));
 *   --nav-search-result-title: hsl(var(--foreground));
 *   --nav-search-result-title-font-family: var(--font-family-mono);
 *   --nav-search-result-link-text: hsl(var(--foreground));
 *   --nav-search-result-link-text-hover: hsl(var(--foreground));
 *   --nav-search-result-link-background: hsl(var(--background));
 *   --nav-search-result-link-background-hover: hsl(var(--contrast-100));
 *   --nav-search-result-link-font-family: var(--font-family-body);
 *   --nav-cart-count-text: hsl(var(--background));
 *   --nav-cart-count-background: hsl(var(--foreground));
 *   --nav-locale-background: hsl(var(--background));
 *   --nav-locale-link-text: hsl(var(--contrast-400));
 *   --nav-locale-link-text-hover: hsl(var(--foreground));
 *   --nav-locale-link-text-selected: hsl(var(--foreground));
 *   --nav-locale-link-background: transparent;
 *   --nav-locale-link-background-hover: hsl(var(--contrast-100));
 *   --nav-locale-link-font-family: var(--font-family-body);
 * }
 * ```
 */
export const Navigation = forwardRef(function Navigation<S extends SearchResult>(
  {
    className,
    isFloating = false,
    cartHref,
    cartCount: streamableCartCount,
    accountHref,
    links: streamableLinks,
    logo: streamableLogo,
    logoHref = '/',
    logoLabel = 'Home',
    logoWidth = 200,
    logoHeight = 40,
    mobileLogo: streamableMobileLogo,
    mobileLogoWidth = 100,
    mobileLogoHeight = 40,
    linksPosition = 'center',
    activeLocaleId,
    locales,
    currencies,
    activeCurrencyId,
    currencyAction,
    searchHref,
    searchParamName = 'query',
    searchAction,
    searchCtaLabel,
    searchInputPlaceholder,
    cartLabel = 'Cart',
    accountLabel = 'Profile',
    openSearchPopupLabel = 'Open search popup',
    searchLabel = 'Search',
    // Top header props with defaults
    shopAtText = DEFAULT_SHOP_AT_TEXT,
    shopAtLink = DEFAULT_SHOP_AT_LINK,
  }: Props<S>,
  ref: Ref<HTMLDivElement>,
) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHirePurchaseEnabled, setIsHirePurchaseEnabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts
  useEffect(() => {
    console.log('Component mounted');
    setIsMounted(true);
    
    // Load initial state from localStorage
    try {
      const savedState = localStorage.getItem('hirePurchaseEnabled');
      console.log('Loaded from localStorage:', savedState);
      if (savedState !== null) {
        setIsHirePurchaseEnabled(savedState === 'true');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    
    return () => {
      setIsMounted(false);
    };
  }, []);

  const pathname = usePathname();
  const [selectedBrand, setSelectedBrand] = useState<string>('vinod-patel');

  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      setIsSearchOpen(false);
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle hire purchase state
  const toggleHirePurchase = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Toggle clicked, current state:', isHirePurchaseEnabled);
    
    setIsHirePurchaseEnabled(prev => {
      const newValue = !prev;
      console.log('Updating state to:', newValue);
      
      // Save to localStorage
      try {
        localStorage.setItem('hirePurchaseEnabled', String(newValue));
        console.log('Saved to localStorage');
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      return newValue;
    });
  }, []);

  return (
    <NavigationMenu.Root
      className={clsx('relative mx-auto w-full', className)}
      delayDuration={0}
      onValueChange={() => setIsSearchOpen(false)}
      ref={ref}
    >

<div className="w-full bg-black border-b border-gray-700 relative z-10">
      <div className="p-2">
        <div className="flex h-8 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <div 
              onClick={toggleHirePurchase}
              className="flex items-center cursor-pointer select-none"
              role="switch"
              aria-checked={isHirePurchaseEnabled}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleHirePurchase(e as any);
                }
              }}
            >
              <div className={`relative h-5 w-10 rounded-full transition-colors duration-200 ease-in-out ${isHirePurchaseEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                <span 
                  className={`absolute top-[2px] left-[2px] h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${isHirePurchaseEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </div>
              <span className="ml-2 text-xs md:text-sm text-white font-medium">
                Hire Purchase
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center space-x-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_1878_41824" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_1878_41824)">
                  <path d="M5.2112 19.75V13.75H4.0957V12.25L5.1727 7.25H19.5187L20.5957 12.25V13.75H19.4802V19.8845H17.9805V13.75H13.7112V19.75H5.2112ZM6.7112 18.25H12.2112V13.75H6.7112V18.25ZM5.1727 5.75V4.25H19.5187V5.75H5.1727ZM5.62645 12.25H19.065L18.3015 8.75H6.38995L5.62645 12.25Z" fill="white"/>
                </g>
              </svg>
              <span className="text-xs md:text-sm text-white whitespace-nowrap">
                Shop at <a href="#" className="underline hover:text-gray-300 transition-colors font-medium">VPG</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
      <div
        className={clsx(
          'flex items-center justify-between bg-black h-[64px] px-6 md:px-8 ',
          isFloating
            ? 'shadow-xl ring-1 ring-[var(--nav-floating-border,hsl(var(--foreground)/10%))]'
            : 'shadow-none ring-0',
        )}
      >
        {/* Logo */}
        <div
          className={clsx(
            'flex items-center justify-start gap-2 self-stretch',
            linksPosition === 'center' ? 'flex-1' : 'flex-1 @4xl:flex-none',
          )}
        >
          {Object.values(brandLogos).map((brand) => {
            const getSvgWithColor = () => {
              if (brand.id === 'vinod-patel' && brand.id !== selectedBrand) {
                // Only replace text elements (those with class containing 'text')
                return brand.svg
                  .replace(/<text[^>]*fill="[^"]*"[^>]*>/g, (match) => 
                    match.replace(/fill="[^"]+"/, 'fill="white"')
                  )
                  .replace(/<tspan[^>]*fill="[^"]*"[^>]*>/g, (match) => 
                    match.replace(/fill="[^"]+"/, 'fill="white"')
                  );
              } else if (brand.id === 'home-living' && brand.id === selectedBrand) {
                return brand.svg.replace(/fill="[^"]+"/g, 'fill="#00B9F2"');
              }
              return brand.svg;
            };

            return (
              <div 
                key={brand.id}
                className={clsx(
                  'p-2 h-full flex items-center justify-center',
                  {'bg-white': brand.id === selectedBrand}
                )}
              >
                <button 
                  onClick={() => setSelectedBrand(brand.id)}
                  className="flex items-center justify-center h-full w-full"
                  aria-label={`Switch to ${brand.name}`}
                >
                  <div 
                    className="w-auto"
                    dangerouslySetInnerHTML={{ __html: getSvgWithColor() }} 
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Top Level Nav Links */}
        {/* <ul
          className={clsx(
            'hidden gap-1 @4xl:flex @4xl:flex-1',
            {
              left: '@4xl:justify-start',
              center: '@4xl:justify-center',
              right: '@4xl:justify-end',
            }[linksPosition],
          )}
        >
          <Stream
            fallback={
              <ul className="flex animate-pulse flex-row p-2 @4xl:gap-2 @4xl:p-5">
                <li>
                  <span className="bg-contrast-100 block h-4 w-10 rounded-md" />
                </li>
                <li>
                  <span className="bg-contrast-100 block h-4 w-14 rounded-md" />
                </li>
                <li>
                  <span className="bg-contrast-100 block h-4 w-24 rounded-md" />
                </li>
                <li>
                  <span className="bg-contrast-100 block h-4 w-16 rounded-md" />
                </li>
              </ul>
            }
            value={streamableLinks}
          >
            {(links) =>
              links.map((item, i) => (
                <NavigationMenu.Item key={i} value={i.toString()}>
                  <NavigationMenu.Trigger asChild>
                    <Link
                      className="hidden items-center rounded-xl bg-[var(--nav-link-background,transparent)] p-2.5 font-[family-name:var(--nav-link-font-family,var(--font-family-body))] text-sm font-medium whitespace-nowrap text-[var(--nav-link-text,hsl(var(--foreground)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors duration-200 hover:bg-[var(--nav-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-link-text-hover,hsl(var(--foreground)))] focus-visible:ring-2 focus-visible:outline-0 @4xl:inline-flex"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenu.Trigger>
                  {item.groups != null && item.groups.length > 0 && (
                    <NavigationMenu.Content className="rounded-2xl bg-[var(--nav-menu-background,hsl(var(--background)))] shadow-xl ring-1 ring-[var(--nav-menu-border,hsl(var(--foreground)/5%))]">
                      <div className="m-auto grid w-full max-w-[var(--breakpoint-lg)] grid-cols-5 justify-center gap-5 px-5 pt-5 pb-8">
                        {item.groups.map((group, columnIndex) => (
                          <ul className="flex flex-col" key={columnIndex}>
                            {/* Second Level Links */}
        {/* {group.label != null && group.label !== '' && (
                              <li>
                                {group.href != null && group.href !== '' ? (
                                  <Link className={navGroupClassName} href={group.href}>
                                    {group.label}
                                  </Link>
                                ) : (
                                  <span className={navGroupClassName}>{group.label}</span>
                                )}
                              </li>
                            )}

                            {group.links.map((link, idx) => (
                              // Third Level Links
                              <li key={idx}>
                                <Link
                                  className="block rounded-lg bg-[var(--nav-sub-link-background,transparent)] px-3 py-1.5 font-[family-name:var(--nav-sub-link-font-family,var(--font-family-body))] text-sm font-medium text-[var(--nav-sub-link-text,hsl(var(--contrast-500)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors hover:bg-[var(--nav-sub-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-sub-link-text-hover,hsl(var(--foreground)))] focus-visible:ring-2 focus-visible:outline-0"
                                  href={link.href}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </NavigationMenu.Content>
                  )}
                </NavigationMenu.Item>
              ))
            }
          </Stream>
        </ul>  */}

        {searchAction ? (
          // <Popover.Root onOpenChange={setIsSearchOpen} open={isSearchOpen}>
          //   <Popover.Anchor className="absolute top-full right-0 left-0" />
          //   <Popover.Trigger asChild>
          //     <button
          //       aria-label={openSearchPopupLabel}
          //       className={navButtonClassName}
          //       onPointerEnter={(e) => e.preventDefault()}
          //       onPointerLeave={(e) => e.preventDefault()}
          //       onPointerMove={(e) => e.preventDefault()}
          //     >
          //       <Search size={20} strokeWidth={1} />
          //     </button>
          //   </Popover.Trigger>
          //   <Popover.Portal>
          //     <Popover.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 @container max-h-[calc(var(--radix-popover-content-available-height)-16px)] w-[var(--radix-popper-anchor-width)] py-2">
          <div className="flex h-[44px] max-h-[inherit] w-1/2 flex-col rounded-full bg-[var(--nav-search-background,hsl(var(--background)))] ring-1 ring-[var(--nav-search-border,hsl(var(--foreground)/5%))] transition-all duration-200 ease-in-out @4xl:inset-x-0">
            <SearchForm
              searchAction={searchAction}
              searchCtaLabel={searchCtaLabel}
              searchHref={searchHref}
              searchInputPlaceholder={searchInputPlaceholder}
              searchParamName={searchParamName}
            />
          </div>
        ) : (
          //     </Popover.Content>
          //   </Popover.Portal>
          // </Popover.Root>
          <Link aria-label={searchLabel} className="relative flex items-center justify-center p-1.5 text-[#717680] hover:text-[#4a4f57] transition-colors" href={searchHref}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333ZM6.7112 18.25H12.2112V13.75H6.7112V18.25ZM5.1727 5.75V4.25H19.5187V5.75H5.1727ZM5.62645 12.25H19.065L18.3015 8.75H6.38995L5.62645 12.25Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
        {/* Icon Buttons */}
        <div
          className={clsx(
            'flex items-center justify-end gap-4 lg:gap-8 transition-colors duration-300',
            linksPosition === 'center' ? 'flex-1' : 'flex-1 @4xl:flex-none',
          )}

        >
           <SearchIcon
      className="lg:hidden shrink-0 text-white w-8 h-8"
      size={20}
      strokeWidth={1}
    />
          <Link aria-label={accountLabel} className={navButtonClassName} href={accountHref}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white hover:text-gray-300 transition-colors">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link aria-label={cartLabel} className={navButtonClassName} href={cartHref}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white hover:text-gray-300 transition-colors">
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6M10 21C10 21.5523 9.55228 22 9 22C8.44772 22 8 21.5523 8 21C8 20.4477 8.44772 20 9 20C9.55228 20 10 20.4477 10 21ZM21 21C21 21.5523 20.5523 22 20 22C19.4477 22 19 21.5523 19 21C19 20.4477 19.4477 20 20 20C20.5523 20 21 20.4477 21 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Stream
              fallback={
                <span className="bg-contrast-100 text-background absolute -top-0.5 -right-0.5 flex h-4 w-4 animate-pulse items-center justify-center rounded-full text-xs" />
              }
              value={streamableCartCount}
            >
              {(cartCount) =>
                cartCount != null &&
                cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--nav-cart-count-background,hsl(var(--foreground)))] font-[family-name:var(--nav-cart-count-font-family,var(--font-family-body))] text-xs text-[var(--nav-cart-count-text,hsl(var(--background)))]">
                    {cartCount}
                  </span>
                )
              }
            </Stream>
          </Link>

          {/* Locale / Language Dropdown */}
          {locales && locales.length > 1 ? (
            <LocaleSwitcher
              activeLocaleId={activeLocaleId}
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              locales={locales as [Locale, Locale, ...Locale[]]}
            />
          ) : null}

          {/* Currency Dropdown */}
          {currencies && currencies.length > 1 && currencyAction ? (
            <CurrencyForm
              action={currencyAction}
              activeCurrencyId={activeCurrencyId}
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              currencies={currencies as [Currency, ...Currency[]]}
            />
          ) : null}
        </div>
      </div>

      <div className="absolute top-full right-0 left-0 z-50 flex w-full justify-center perspective-[2000px]">
        <NavigationMenu.Viewport className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative mt-2 w-full" />
      </div>
    </NavigationMenu.Root>
  );
});

Navigation.displayName = 'Navigation';

function SearchForm<S extends SearchResult>({
  searchAction,
  searchParamName = 'query',
  searchHref = '/search',
  searchInputPlaceholder = 'Search Products',
  searchCtaLabel = 'View more',
  submitLabel = 'Submit',
}: {
  searchAction: SearchAction<S>;
  searchParamName?: string;
  searchHref?: string;
  searchCtaLabel?: string;
  searchInputPlaceholder?: string;
  submitLabel?: string;
}) {
  const [query, setQuery] = useState('');
  const [isSearching, startSearching] = useTransition();
  const [{ searchResults, lastResult, emptyStateTitle, emptyStateSubtitle }, formAction] =
    useActionState(searchAction, {
      searchResults: null,
      lastResult: null,
    });
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPending = isSearching || isDebouncing || isSubmitting;
  const debouncedOnChange = useMemo(() => {
    const debounced = debounce((q: string) => {
      setIsDebouncing(false);

      const formData = new FormData();

      formData.append(searchParamName, q);

      startSearching(() => {
        formAction(formData);
      });
    }, 300);

    return (q: string) => {
      setIsDebouncing(true);

      debounced(q);
    };
  }, [formAction, searchParamName]);

  const [form] = useForm({ lastResult });

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
  }, []);

  return (
    <>
      <form
        action={searchHref}
        className="hidden lg:flex items-center gap-3 px-3 py-2.5 bg-white rounded-full"

        onSubmit={handleSubmit}
      >
        <input
          className="grow  pl-2 text-[16px] font-medium outline-0 focus-visible:outline-hidden @xl:pl-0"
          name={searchParamName}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
            debouncedOnChange(e.currentTarget.value);
          }}
          placeholder={searchInputPlaceholder}
          type="text"
          value={query}
        />
        <SubmitButton loading={isPending} submitLabel={submitLabel} />
      </form>

      <SearchResults
        emptySearchSubtitle={emptyStateSubtitle}
        emptySearchTitle={emptyStateTitle}
        errors={form.errors}
        query={query}
        searchCtaLabel={searchCtaLabel}
        searchParamName={searchParamName}
        searchResults={searchResults}
        stale={isPending}
      />
    </>
  );
}

function SubmitButton({ loading, submitLabel }: { loading: boolean; submitLabel: string }) {
  const { pending } = useFormStatus();

  return (
    // <Button
    //   loading={pending || loading}
    //   shape="circle"
    //   size="small"
    //   type="submit"
    //   variant="secondary"
    // >
    <SearchIcon
      className="shrink-0 text-[var(--nav-search-icon,hsl(var(--contrast-500)))]"
      size={20}
      strokeWidth={1}
    />
    // </Button>
  );
}

function SearchResults({
  query,
  searchResults,
  stale,
  emptySearchTitle = `No results were found for '${query}'`,
  emptySearchSubtitle = 'Please try another search.',
  errors,
}: {
  query: string;
  searchParamName: string;
  searchCtaLabel?: string;
  emptySearchTitle?: string;
  emptySearchSubtitle?: string;
  searchResults: SearchResult[] | null;
  stale: boolean;
  errors?: string[];
}) {
  if (query === '') return null;

  if (errors != null && errors.length > 0) {
    if (stale) return null;

    return (
      <div className="fixed z-[999] flex flex-col border-t border-[var(--nav-search-divider,hsl(var(--contrast-100)))] p-6">
        {errors.map((error) => (
          <FormStatus key={error} type="error">
            {error}
          </FormStatus>
        ))}
      </div>
    );
  }

  if (searchResults == null || searchResults.length === 0) {
    if (stale) return null;

    return (
      <div className="flex flex-col fixed z-[999] top-[54px] border-t border-[var(--nav-search-divider,hsl(var(--contrast-100)))] p-6">
        <p className="text-2xl font-medium text-[var(--nav-search-empty-title,hsl(var(--foreground)))]">
          {emptySearchTitle}
        </p>
        <p className="text-[var(--nav-search-empty-subtitle,hsl(var(--contrast-500)))]">
          {emptySearchSubtitle}
        </p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'fixed z-[999] w-full h-full flex flex-1 flex-col bg-white max-w-[710px] ml-4 top-[54px] overflow-y-auto border-t border-[var(--nav-search-divider,hsl(var(--contrast-100)))] @2xl:flex-row',
        stale && 'opacity-50',
      )}
    >
      {searchResults.map((result, index) => {
        switch (result.type) {
          case 'links': {
            return (
              <section
                aria-label={result.title}
                className="flex w-full flex-col gap-6 border-b border-[var(--nav-search-divider,hsl(var(--contrast-100)))] p-5 @2xl:max-w-80 @2xl:border-r @2xl:border-b-0"
                key={`result-${index}`}
              >
                <h3 className="mb-4 font-[family-name:var(--nav-search-result-title-font-family,var(--font-family-mono))] text-sm text-[var(--nav-search-result-title,hsl(var(--foreground)))] uppercase">
                  {result.title}
                </h3>
                <ul role="listbox">
                  {result.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        className="block rounded-lg bg-[var(--nav-search-result-link-background,transparent)] px-3 py-4 font-[family-name:var(--nav-search-result-link-font-family,var(--font-family-body))] font-semibold text-[var(--nav-search-result-link-text,hsl(var(--contrast-500)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors hover:bg-[var(--nav-search-result-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-search-result-link-text-hover,hsl(var(--foreground)))] focus-visible:ring-2 focus-visible:outline-0"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          }

          case 'products': {
            return (
              <section
                aria-label={result.title}
                className="flex w-full flex-col gap-5 p-5"
                key={`result-${index}`}
              >
                <h3 className="font-[family-name:var(--nav-search-result-title-font-family,var(--font-family-mono))] text-sm text-[var(--nav-search-result-title,hsl(var(--foreground)))] uppercase">
                  {result.title}
                </h3>
                <ul
                  className="grid w-full grid-cols-2 gap-5"
                  role="listbox"
                >
                  {result.products.map((product) => (
                    <li key={product.id} className='w-full'>
                      <ProductCard
                        imageSizes="(min-width: 42rem) 25vw, 50vw"
                        product={{
                          id: product.id,
                          title: product.title,
                          href: product.href,
                          price: product.price,
                          image: product.image,
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

const useSwitchLocale = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  return useCallback(
    (locale: string) =>
      router.push(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale },
      ),
    [pathname, params, router],
  );
};

function LocaleSwitcher({
  locales,
  activeLocaleId,
}: {
  activeLocaleId?: string;
  locales: [Locale, ...Locale[]];
}) {
  const activeLocale = locales.find((locale) => locale.id === activeLocaleId);
  const [isPending, startTransition] = useTransition();
  const switchLocale = useSwitchLocale();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={clsx(
          'flex items-center gap-1 text-xs uppercase transition-opacity disabled:opacity-30',
          navButtonClassName,
        )}
        disabled={isPending}
      >
        {activeLocale?.id ?? locales[0].id}
        <ChevronDown size={16} strokeWidth={1.5} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-80 overflow-y-scroll rounded-xl bg-[var(--nav-locale-background,hsl(var(--background)))] p-2 shadow-xl @4xl:w-32 @4xl:rounded-2xl @4xl:p-2"
          sideOffset={16}
        >
          {locales.map(({ id, label }) => (
            <DropdownMenu.Item
              className={clsx(
                'cursor-default rounded-lg bg-[var(--nav-locale-link-background,transparent)] px-2.5 py-2 font-[family-name:var(--nav-locale-link-font-family,var(--font-family-body))] text-sm font-medium text-[var(--nav-locale-link-text,hsl(var(--contrast-400)))] ring-[var(--nav-focus,hsl(var(--primary)))] outline-hidden transition-colors hover:bg-[var(--nav-locale-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-locale-link-text-hover,hsl(var(--foreground)))]',
                {
                  'text-[var(--nav-locale-link-text-selected,hsl(var(--foreground)))]':
                    id === activeLocaleId,
                },
              )}
              key={id}
              onSelect={() => startTransition(() => switchLocale(id))}
            >
              {label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function CurrencyForm({
  action,
  currencies,
  activeCurrencyId,
}: {
  activeCurrencyId?: string;
  action: CurrencyAction;
  currencies: [Currency, ...Currency[]];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastResult, formAction] = useActionState(action, null);
  const activeCurrency = currencies.find((currency) => currency.id === activeCurrencyId);

  useEffect(() => {
    // eslint-disable-next-line no-console
    if (lastResult?.error) console.log(lastResult.error);
  }, [lastResult?.error]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={clsx(
          'flex items-center gap-1 text-xs uppercase transition-opacity disabled:opacity-30',
          navButtonClassName,
        )}
        disabled={isPending}
      >
        {activeCurrency?.label ?? currencies[0].label}
        <ChevronDown size={16} strokeWidth={1.5} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-80 overflow-y-scroll rounded-xl bg-[var(--nav-locale-background,hsl(var(--background)))] p-2 shadow-xl @4xl:w-32 @4xl:rounded-2xl @4xl:p-2"
          sideOffset={16}
        >
          {currencies.map((currency) => (
            <DropdownMenu.Item
              className={clsx(
                'cursor-default rounded-lg bg-[var(--nav-locale-link-background,transparent)] px-2.5 py-2 font-[family-name:var(--nav-locale-link-font-family,var(--font-family-body))] text-sm font-medium text-[var(--nav-locale-link-text,hsl(var(--contrast-400)))] ring-[var(--nav-focus,hsl(var(--primary)))] outline-hidden transition-colors hover:bg-[var(--nav-locale-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-locale-link-text-hover,hsl(var(--foreground)))]',
                {
                  'text-[var(--nav-locale-link-text-selected,hsl(var(--foreground)))]':
                    currency.id === activeCurrencyId,
                },
              )}
              key={currency.id}
              onSelect={() => {
                // eslint-disable-next-line @typescript-eslint/require-await
                startTransition(async () => {
                  const formData = new FormData();

                  formData.append('id', currency.id);
                  formAction(formData);

                  // This is needed to refresh the Data Cache after the product has been added to the cart.
                  // The cart id is not picked up after the first time the cart is created/updated.
                  router.refresh();
                });
              }}
            >
              {currency.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
