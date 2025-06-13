import { getLocale, getTranslations } from 'next-intl/server';
import { cache } from 'react';
import { GetLinksAndSectionsQuery, LayoutQuery } from '~/app/[locale]/(default)/page-data';
import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql, readFragment } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { TAGS } from '~/client/tags';
import { logoTransformer } from '~/data-transformers/logo-transformer';
import { routing } from '~/i18n/routing';
import { getCartId } from '~/lib/cart';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { SiteHeader as HeaderSection } from '~/lib/makeswift/components/site-header/site-header';

import { search } from './_actions/search';
import { switchCurrency } from './_actions/switch-currency';
import { HeaderFragment, HeaderLinksFragment } from './fragment';
import CategoryNavigation from '@/vibes/soul/primitives/mega-menu';

const GetCartCountQuery = graphql(`
  query GetCartCountQuery($cartId: String) {
    site {
      cart(entityId: $cartId) {
        entityId
        lineItems {
          totalQuantity
        }
      }
    }
  }
`);

const getCartCount = async (cartId: string, customerAccessToken?: string) => {
  const response = await client.fetch({
    document: GetCartCountQuery,
    variables: { cartId },
    customerAccessToken,
    fetchOptions: {
      cache: 'no-store',
      next: {
        tags: [TAGS.cart],
      },
    },
  });

  return response.data.site.cart?.lineItems.totalQuantity ?? null;
};

const getHeaderLinks = cache(async (customerAccessToken?: string) => {
  const { data: response } = await client.fetch({
    document: GetLinksAndSectionsQuery,
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });

  return readFragment(HeaderLinksFragment, response).site.categoryTree;
});

const getHeaderData = cache(async () => {
  const { data: response } = await client.fetch({
    document: LayoutQuery,
    fetchOptions: { next: { revalidate } },
  });

  return readFragment(HeaderFragment, response).site;
});

export const Header = async () => {
  const t = await getTranslations('Components.Header');
  const locale = await getLocale();

  const data = await getHeaderData();

  const logo = data.settings ? logoTransformer(data.settings) : '';

  const locales = routing.locales.map((enabledLocales) => ({
    id: enabledLocales,
    label: enabledLocales.toLocaleUpperCase(),
  }));

  const currencies = data.currencies.edges
    ? data.currencies.edges
        // only show transactional currencies for now until cart prices can be rendered in display currencies
        .filter(({ node }) => node.isTransactional)
        .map(({ node }) => ({
          id: node.code,
          label: node.code,
          isDefault: node.isDefault,
        }))
    : [];

  const links = await (async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const categoryTree = await getHeaderLinks(customerAccessToken);

    /*
    Currently, the navigation menu is designed to display only 6 categories.
    If you need to show more than 6 categories, you'll need to update the navigation menu styles accordingly.
    Will require modification of navigation menu styles to accommodate the additional categories.
    */
    const slicedTree = categoryTree.slice(0, 6);

    return slicedTree.map(({ name, path, children }) => ({
      label: name,
      href: path,
      groups: children.map((firstChild) => ({
        label: firstChild.name,
        href: firstChild.path,
        links: firstChild.children.map((secondChild) => ({
          label: secondChild.name,
          href: secondChild.path,
        })),
      })),
    }));
  })();

  const cartCount = await (async () => {
    const cartId = await getCartId();
    if (!cartId) return null;
    
    const customerAccessToken = await getSessionCustomerAccessToken();
    return getCartCount(cartId, customerAccessToken);
  })();

  const activeCurrencyId = await (async () => {
    const currencyCode = await getPreferredCurrencyCode();
    const defaultCurrency = currencies.find(({ isDefault }) => isDefault);
    return currencyCode ?? defaultCurrency?.id;
  })();

  return (
    <div>
      <HeaderSection
        navigation={{
          accountHref: '/account',
          cartHref: '/cart',
          cartLabel: t('Icons.cart'),
          searchHref: '/search',
          searchParamName: 'term',
          searchAction: search,
          links,
          logo,
          mobileMenuTriggerLabel: t('toggleNavigation'),
          openSearchPopupLabel: t('Icons.search'),
          logoLabel: t('home'),
          cartCount,
          activeLocaleId: locale,
          locales,
          currencies,
          activeCurrencyId,
          currencyAction: switchCurrency,
        }}
      />
      <CategoryNavigation />
    </div>
  );
};
