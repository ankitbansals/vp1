import { clsx } from 'clsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import {
  Carousel,
  CarouselButtons,
  CarouselContent,
  CarouselItem,
} from '@/vibes/soul/primitives/carousel';
import { ProductCardSkeleton } from '@/vibes/soul/primitives/product-card';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import ProductCard from '../../primitives/custom-product-card';
import Image from 'next/image';
import { CustomProductCardProps } from '~/types/custom-product-card';
export type CarouselProduct = CustomProductCardProps;

export interface ProductCarouselProps {
  products: Streamable<CustomProductCardProps[]>;
  className?: string;
  emptyStateTitle?: Streamable<string>;
  emptyStateSubtitle?: Streamable<string>;
  scrollbarLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  placeholderCount?: number;
  showButtons?: boolean;
  showScrollbar?: boolean;
  hideOverflow?: boolean;
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
  showImageBanner?: boolean;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --product-carousel-light-empty-title: hsl(var(--foreground));
 *   --product-carousel-light-empty-subtitle: hsl(var(--contrast-500));
 *   --product-carousel-dark-empty-title: hsl(var(--background));
 *   --product-carousel-dark-empty-subtitle: hsl(var(--contrast-100));
 *   --product-carousel-empty-title-font-family: var(--font-family-heading);
 *   --product-carousel-empty-subtitle-font-family: var(--font-family-body);
 * }
 * ```
 */
export function ProductCarousel({
  products: streamableProducts,
  className,
  emptyStateTitle = 'No products found',
  emptyStateSubtitle = 'Try browsing our complete catalog of products.',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  placeholderCount = 8,
  showButtons = true,
  hideOverflow = true,
  title = 'New Arrivals',
  imageSrc,
  imageAlt = 'Banner Image',
  showImageBanner = false,
}: ProductCarouselProps) {
  return (
    <Stream
      fallback={
        <ProductsCarouselSkeleton
          className={className}
          hideOverflow={hideOverflow}
          placeholderCount={placeholderCount}
        />
      }
      value={streamableProducts}
    >
      {(products) => {
        if (products.length === 0) {
          return (
            <ProductsCarouselEmptyState
              className={className}
              emptyStateSubtitle={emptyStateSubtitle}
              emptyStateTitle={emptyStateTitle}
              hideOverflow={hideOverflow}
              placeholderCount={placeholderCount}
            />
          );
        }

        return (
          <div className={clsx('relative', className)}>
            <div className="relative flex gap-16">
              {/* Static Banner */}
              {showImageBanner && imageSrc && (
                <div className="sticky top-4 hidden h-fit shrink-0 basis-[440px] @lg:block">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold leading-7 text-gray-950 @md:text-3xl @md:leading-9">
                      {title}
                    </h2>
                  </div>
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    className="h-[600px] w-[440px] rounded-lg object-cover"
                    width={440}
                    height={600}
                  />
                </div>
              )}
              
              {/* Scrollable Products */}
              <div className="flex-1">

                <Carousel hideOverflow={hideOverflow}>
                <div className={`mb-8 flex w-full gap-5 ${!showImageBanner ? 'justify-between' : 'justify-end'}`}>
                  {!showImageBanner && (
                    <h2 className="text-2xl font-bold leading-7 text-gray-950 @md:text-3xl @md:leading-9">
                      {title}
                    </h2>
                  )}
                  {showButtons && (
                    <div className="mb-4 flex justify-end gap-4">
                      <CarouselButtons
                        nextLabel={nextLabel}
                        previousLabel={previousLabel}
                      />
                    </div>
                  )}
                </div>
                  <CarouselContent className="mb-10 gap-5 xl:gap-8">
                    {products.map((product, index) => (
                      <CarouselItem
                        className="w-full max-w-[308px] basis-full @md:basis-1/2 @lg:basis-1/3 @2xl:basis-1/4"
                        key={index}
                      >
                        <ProductCard {...product} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </div>
        );
      }}
    </Stream>
  );
}

export function ProductsCarouselSkeleton({
  className,
  placeholderCount = 8,
  hideOverflow,
}: Pick<ProductCarouselProps, 'className' | 'placeholderCount' | 'hideOverflow'>) {
  return (
    <Skeleton.Root
      className={clsx('group-has-data-pending/product-carousel:animate-pulse', className)}
      hideOverflow={hideOverflow}
      pending
    >
      <div className="w-full">
        <div className="-ml-4 flex @2xl:-ml-5">
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <div
              className="min-w-0 shrink-0 grow-0 basis-full pl-4 @md:basis-1/2 @lg:basis-1/3 @2xl:basis-1/4 @2xl:pl-5"
              key={index}
            >
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 flex w-full items-center justify-between gap-8">
        <Skeleton.Box className="h-1 w-56 rounded-sm" />
        <div className="flex gap-2">
          <Skeleton.Icon icon={<ArrowLeft aria-hidden className="h-6 w-6" strokeWidth={1.5} />} />
          <Skeleton.Icon icon={<ArrowRight aria-hidden className="h-6 w-6" strokeWidth={1.5} />} />
        </div>
      </div>
    </Skeleton.Root>
  );
}

export function ProductsCarouselEmptyState({
  className,
  placeholderCount = 8,
  emptyStateTitle,
  emptyStateSubtitle,
  hideOverflow,
}: Pick<
  ProductCarouselProps,
  'className' | 'placeholderCount' | 'emptyStateTitle' | 'emptyStateSubtitle' | 'hideOverflow'
>) {
  return (
    <Skeleton.Root className={clsx('relative', className)} hideOverflow={hideOverflow}>
      <div className="w-full">
        <div className="-ml-4 flex [mask-image:linear-gradient(to_bottom,_black_0%,_transparent_90%)] @2xl:-ml-5">
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <div
              className="min-w-0 shrink-0 grow-0 basis-full pl-4 @md:basis-1/2 @lg:basis-1/3 @2xl:basis-1/4 @2xl:pl-5"
              key={index}
            >
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 mx-auto px-3 py-16 pb-3 @4xl:px-10 @4xl:pt-28 @4xl:pb-10">
        <div className="mx-auto max-w-xl space-y-2 text-center @4xl:space-y-3">
          <h3
            className={clsx(
              'font-[family-name:var(--product-carousel-empty-title-font-family,var(--font-family-heading))] text-2xl leading-tight @4xl:text-4xl @4xl:leading-none',
            )}
          >
            {emptyStateTitle}
          </h3>
          <p
            className={clsx(
              'font-[family-name:var(--product-carousel-empty-subtitle-font-family,var(--font-family-body))] text-sm @4xl:text-lg',
            )}
          >
            {emptyStateSubtitle}
          </p>
        </div>
      </div>
    </Skeleton.Root>
  );
}
