import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren, ReactNode } from 'react'; // Added ReactNode type

import '../../globals.css';

import { fonts } from '~/app/fonts';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { routing } from '~/i18n/routing';
import { SiteTheme } from '~/lib/makeswift/components/site-theme';
import { MakeswiftProvider } from '~/lib/makeswift/provider';

import { getToastNotification } from '../../lib/server-toast';
import { CookieNotifications } from '../notifications';
import { Providers } from '../providers';

import '~/lib/makeswift/components';
import { getCurrentBrand } from '~/theme';
import { BrandThemeProvider } from '~/theme/theme-provider';

const RootLayoutMetadataQuery = graphql(`
  query RootLayoutMetadataQuery {
    site {
      settings {
        storeName
        seo {
          pageTitle
          metaDescription
          metaKeywords
        }
      }
    }
  }
`);

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await client.fetch({
    document: RootLayoutMetadataQuery,
    fetchOptions: { next: { revalidate } },
  });

  const storeName = data.site.settings?.storeName ?? '';

  const { pageTitle, metaDescription, metaKeywords } = data.site.settings?.seo || {};

  return {
    title: {
      template: `%s - ${storeName}`,
      default: pageTitle || storeName,
    },
    icons: {
      icon: '/favicon.ico', // app/favicon.ico/route.ts
    },
    description: metaDescription,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    other: {
      platform: 'bigcommerce.catalyst',
      build_sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? '',
      store_hash: process.env.BIGCOMMERCE_STORE_HASH ?? '',
    },
  };
}

const VercelComponents = () => {
  if (process.env.VERCEL !== '1') {
    return null;
  }

  return (
    <>
      {process.env.DISABLE_VERCEL_ANALYTICS !== 'true' && <Analytics />}
      {process.env.DISABLE_VERCEL_SPEED_INSIGHTS !== 'true' && <SpeedInsights />}
    </>
  );
};

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ params, children }: Props) {
  const { locale } = await params;
  const toastNotificationCookieData = await getToastNotification();

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // need to call this method everywhere where static rendering is enabled
  // https://next-intl-docs.vercel.app/docs/getting-started/app-router#add-setRequestLocale-to-all-layouts-and-pages
  setRequestLocale(locale);

  const previewMode = (await draftMode()).isEnabled;
  
  // Brand detection is now handled by the BrandThemeProvider
  
  return (
    <html
      lang={locale}
      className={clsx(
        'h-full scroll-smooth',
        ...fonts.map((font) => font.variable), // Spread font variables
        'theme-vinod-patel' // Default theme class
      )}
      suppressHydrationWarning
      data-theme="vinod-patel" // Default theme data attribute
    >
      <body className="flex h-full flex-col bg-background text-foreground">
       
        
          <MakeswiftProvider previewMode={previewMode}>
            <BrandThemeProvider>
              <Providers>
                <NextIntlClientProvider locale={locale}>
                  <SiteTheme>
                    <NuqsAdapter>
                      <div className="min-h-screen flex flex-col">
                        <VercelComponents />
                        <main className="flex-1">
                          {children}
                        </main>
                        {toastNotificationCookieData && (
                          <CookieNotifications {...toastNotificationCookieData} />
                        )}
                          </div>
                    </NuqsAdapter>
                  </SiteTheme>
                </NextIntlClientProvider>
              </Providers>
            </BrandThemeProvider>
          </MakeswiftProvider>
        
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const fetchCache = 'default-cache';
