import createWithMakeswift from '@makeswift/runtime/next/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { writeBuildConfig } from './build-config/writer';
import { client } from './client';
import { graphql } from './client/graphql';
import { cspHeader } from './lib/content-security-policy';

const withMakeswift = createWithMakeswift();
const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json',
  },
});

const SettingsQuery = graphql(`
  query SettingsQuery {
    site {
      settings {
        url {
          vanityUrl
          cdnUrl
          checkoutUrl
        }
        locales {
          code
          isDefault
        }
      }
    }
  }
`);

async function writeSettingsToBuildConfig() {
  const { data } = await client.fetch({ document: SettingsQuery });

  return await writeBuildConfig({
    locales: data.site.settings?.locales,
    urls: {
      ...data.site.settings?.url,
      cdnUrl: process.env.NEXT_PUBLIC_BIGCOMMERCE_CDN_HOSTNAME ?? data.site.settings?.url.cdnUrl,
    },
  });
}

export default async (): Promise<NextConfig> => {
  const settings = await writeSettingsToBuildConfig();

  let nextConfig: NextConfig = {
    env: {
      // BigCommerce API Configuration
      BIGCOMMERCE_STORE_HASH: process.env.BIGCOMMERCE_STORE_HASH,
      BIGCOMMERCE_STOREFRONT_TOKEN: process.env.BIGCOMMERCE_STOREFRONT_TOKEN,
      BIGCOMMERCE_CHANNEL_ID: process.env.BIGCOMMERCE_CHANNEL_ID,
      BIGCOMMERCE_ACCESS_TOKEN: process.env.BIGCOMMERCE_ACCESS_TOKEN,
      BIGCOMMERCE_STOREFRONT_API_TOKEN: process.env.BIGCOMMERCE_STOREFRONT_API_TOKEN,
      
      // OAuth Configuration
      CLIENT_ID: process.env.CLIENT_ID,
      CLIENT_SECRET: process.env.CLIENT_SECRET,
      
      // CDN Configuration
      NEXT_PUBLIC_BIGCOMMERCE_CDN_HOSTNAME: process.env.NEXT_PUBLIC_BIGCOMMERCE_CDN_HOSTNAME,
      
      // Other environment variables
      ENABLE_ADMIN_ROUTE: process.env.ENABLE_ADMIN_ROUTE,
      AUTH_SECRET: process.env.AUTH_SECRET,
      MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
      TURBO_REMOTE_CACHE_SIGNATURE_KEY: process.env.TURBO_REMOTE_CACHE_SIGNATURE_KEY,
    },
    reactStrictMode: true,
    experimental: {
      optimizePackageImports: ['@icons-pack/react-simple-icons'],
      ppr: 'incremental',
    },
    typescript: {
      ignoreBuildErrors: !!process.env.CI,
    },
    eslint: {
      ignoreDuringBuilds: !!process.env.CI,
      dirs: [
        'app',
        'auth',
        'build-config',
        'client',
        'components',
        'data-transformers',
        'i18n',
        'lib',
        'middlewares',
        'scripts',
        'tests',
        'vibes',
      ],
    },
    // default URL generation in BigCommerce uses trailing slash
    trailingSlash: process.env.TRAILING_SLASH !== 'false',
    // Configure image optimization to allow images from all domains
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
        {
          protocol: 'http',
          hostname: '**',
        },
      ],
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: cspHeader.replace(/\n/g, ''),
            },
            {
              key: 'Link',
              value: `<https://${settings.urls.cdnUrl}>; rel=preconnect`,
            },
          ],
        },
      ];
    },
  };

  // Apply withNextIntl to the config
  nextConfig = withNextIntl(nextConfig);

  // Apply withMakeswift to the config
  nextConfig = withMakeswift(nextConfig);

  if (process.env.ANALYZE === 'true') {
    const withBundleAnalyzer = bundleAnalyzer();

    nextConfig = withBundleAnalyzer(nextConfig);
  }

  return nextConfig;
};
