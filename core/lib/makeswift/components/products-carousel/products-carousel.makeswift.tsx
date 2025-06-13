'use client';

import {
  Checkbox,
  Combobox,
  Group,
  List,
  Number,
  Select,
  Style,
  TextInput,
  Image,
} from '@makeswift/runtime/controls';
import { ComponentPropsWithoutRef } from 'react';

import { ProductCarousel, ProductsCarouselSkeleton } from '@/vibes/soul/sections/product-carousel';
import { runtime } from '~/lib/makeswift/runtime';

import { searchProducts } from '../../utils/search-products';
import { useProducts } from '../../utils/use-products';

type MSProductsCarouselProps = Omit<
  ComponentPropsWithoutRef<typeof ProductCarousel>,
  'products'
> & {
  className: string;
  collection: 'none' | 'best-selling' | 'newest' | 'featured';
  limit: number;
  additionalProducts: Array<{
    entityId?: string;
  }>;
};

runtime.registerComponent(
  function MSProductsCarousel({
    className,
    collection,
    limit,
    additionalProducts,
    hideOverflow,
    ...props
  }: MSProductsCarouselProps) {
    const additionalProductIds = additionalProducts.map(({ entityId }) => entityId ?? '');
    const { products, isLoading } = useProducts({
      collection,
      collectionLimit: limit,
      additionalProductIds,
    });

    if (isLoading) {
      return <ProductsCarouselSkeleton className={className} hideOverflow={hideOverflow} />;
    }

    if (products == null || products.length === 0) {
      return <ProductsCarouselSkeleton className={className} hideOverflow={hideOverflow} />;
    }

    return (
      <ProductCarousel
        {...props}
        className={className}
        hideOverflow={hideOverflow}
        products={products}
      />
    );
  },
  {
    type: 'primitive-products-carousel',
    label: 'Catalog / Products Carousel',
    icon: 'carousel',
    props: {
      className: Style(),
      title: TextInput({ label: 'Title', defaultValue: 'Newest Arrivals' }),
      collection: Select({
        label: 'Product collection',
        options: [
          { value: 'none', label: 'None (static only)' },
          { value: 'best-selling', label: 'Best selling' },
          { value: 'newest', label: 'Newest' },
          { value: 'featured', label: 'Featured' },
        ],
        defaultValue: 'newest',
      }),
      limit: Number({ label: 'Max collection items', defaultValue: 12 }),
      additionalProducts: List({
        label: 'Additional products',
        type: Group({
          label: 'Product',
          props: {
            title: TextInput({ label: 'Title', defaultValue: 'Product title' }),
            entityId: Combobox({
              label: 'Product',
              async getOptions(query) {
                const products = await searchProducts(query);

                return products.map((product) => ({
                  id: product.entityId.toString(),
                  label: product.name,
                  value: product.entityId.toString(),
                }));
              },
            }),
          },
        }),
        getItemLabel(product) {
          return product?.title || 'Product';
        },
      }),
      showImageBanner: Checkbox({
        label: 'Show banner',
        defaultValue: false,
      }),
      imageSrc: Image({ label: 'Image' }),
      imageAlt: TextInput({ label: 'Image Alt/Title' }),
      showScrollbar: Checkbox({
        label: 'Show scrollbar',
        defaultValue: true,
      }),
      showButtons: Checkbox({
        label: 'Show buttons',
        defaultValue: true,
      }),
      hideOverflow: Checkbox({
        label: 'Hide overflow',
        defaultValue: true,
      }),
    },
  },
);
