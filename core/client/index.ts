import { BigCommerceAuthError, createClient } from '@bigcommerce/catalyst-client';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { redirect } from 'next/navigation';
import { getLocale as getServerLocale } from 'next-intl/server';

import { getChannelIdFromLocale } from '../channels.config';
import { backendUserAgent } from '../userAgent';
import { ClientConstants } from '../constants/client';

const getLocale = async () => {
  try {
    const locale = await getServerLocale();

    return locale;
  } catch {
    /**
     * Next-intl `getLocale` only works on the server, and when middleware has run.
     *
     * Instances when `getLocale` will not work:
     * - Requests in middlewares
     * - Requests in `generateStaticParams`
     * - Request in api routes
     * - Requests in static sites without `setRequestLocale`
     */
  }
};

export const client = createClient({
  storefrontToken: process.env[ClientConstants.ENV_VARS.STOREFRONT_TOKEN] ?? '',
  xAuthToken: process.env[ClientConstants.ENV_VARS.ACCESS_TOKEN] ?? '',
  storeHash: process.env[ClientConstants.ENV_VARS.STORE_HASH] ?? '',
  channelId: process.env[ClientConstants.ENV_VARS.CHANNEL_ID],
  backendUserAgentExtensions: backendUserAgent,
  logger:
    (process.env[ClientConstants.ENV_VARS.NODE_ENV] !== 'production' && 
     process.env[ClientConstants.ENV_VARS.CLIENT_LOGGER] !== 'false') ||
    process.env[ClientConstants.ENV_VARS.CLIENT_LOGGER] === 'true',
  getChannelId: async (defaultChannelId: string) => {
    const locale = await getLocale();

    // We use the default channelId as a fallback, but it is not ideal in some scenarios.
    return getChannelIdFromLocale(locale) ?? defaultChannelId;
  },
  beforeRequest: async (fetchOptions) => {
    const requestHeaders: Record<string, string> = {};
    const locale = await getLocale();

    // For Pages Router, we can't access headers directly
    // IP address handling would need to be done at the API level
    // and passed through context or cookies

    if (locale) {
      requestHeaders[ClientConstants.HEADERS.ACCEPT_LANGUAGE] = locale;
    }

    return {
      headers: requestHeaders,
    };
  },
  onError(error) {
    if (typeof window !== 'undefined' && error instanceof BigCommerceAuthError) {
      // Client-side redirect
      window.location.href = ClientConstants.ROUTES.LOGIN;
    } else if (error instanceof BigCommerceAuthError) {
      // Server-side error handling
      console.error('Authentication error:', error);
      // In a real app, you might want to throw a redirect error that your error boundary can catch
    }
  },
});
