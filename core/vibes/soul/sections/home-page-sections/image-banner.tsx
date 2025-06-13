'use client';
import React from 'react';
import Image from 'next/image';
import { Typography } from '../../primitives/typography';
import { CTALink } from '../../primitives/cta-link';
import { getBadgeStyles } from '../../lib/get-badge-style';
import { ImageBannerProps } from '~/types/brands-banners-categories';

// Simple custom loader for Next.js Image
const customLoader = ({ src }: { src: string }) => {
  return src;
};

export function ImageBanner({
  title,
  heading,
  description,
  ctaLabel,
  cta,
  ctaReference,
  ctaHref,
  imageSrc,
  imageAlt,
  showNewBadge,
  showBadge,
  badgeLabel,
  badgeVariant,
  variant,
  className,
  imageUrl,
}: ImageBannerProps) {
  const finalTitle = title || heading;
  const finalCtaLabel = ctaLabel || cta;
  const finalCtaReference = ctaReference || ctaHref;
  const finalShowBadge = showNewBadge !== undefined ? showNewBadge : showBadge;

  // Handle the image URL from either source
  if (imageUrl && !imageSrc) {
    imageSrc = imageUrl;
  }
  const isSimpleVariant = variant === 'standard';

  return (
    <section className={`w-full ${className}`}>
      <div className="px-4 pb-20">
        <div className={`relative ${isSimpleVariant ? 'bg-[#fffbfb]' : 'bg-[#B8002E]'}`}>
          <div className={`flex min-h-[220px] flex-col-reverse items-center md:flex-row`}>
            {/* Content Section */}
            <div
              className={`flex w-full flex-col ${isSimpleVariant ? 'md:w-1/2' : 'md:w-[55%]'} z-10 p-4 sm:p-6 md:p-8`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Typography
                  as="h2"
                  className={`font-display text-xl font-bold sm:text-2xl ${isSimpleVariant ? 'text-gray-900' : 'text-white'}`}
                >
                  {finalTitle}
                </Typography>
                {finalShowBadge && badgeLabel && (
                  <span
                    className={`inline-flex rounded-full border ${getBadgeStyles(badgeVariant)} px-2 py-0.5 text-xs whitespace-nowrap`}
                  >
                    {badgeLabel}
                  </span>
                )}
              </div>
              <Typography
                as="p"
                className={`font-body text-sm font-normal sm:text-base ${
                  isSimpleVariant ? 'text-gray-600' : 'text-white opacity-90'
                } mb-4 max-w-[95%] sm:mb-6 sm:max-w-[90%]`}
              >
                {description}
              </Typography>
              {finalCtaReference && finalCtaLabel && (
                <div className="flex">
                  <CTALink
                    label={finalCtaLabel}
                    reference={finalCtaReference}
                    className={`font-body inline-flex items-center text-sm font-semibold ${
                      isSimpleVariant
                        ? 'text-brand-600 hover:text-brand-700'
                        : 'text-white hover:text-white hover:opacity-90'
                    } transition-colors`}
                  >
                    <svg
                      className="ml-2 h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 8H15M15 8L8 1M15 8L8 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </CTALink>
                </div>
              )}
            </div>

            {/* Image Section */}
            <div
              className={`relative w-full ${isSimpleVariant ? 'md:w-1/2' : 'md:w-[42%]'} h-[180px] sm:h-[200px] md:h-[220px]`}
            >
              {imageSrc && (
                <div className="relative h-full w-full">
                  <Image
                    src={imageSrc}
                    alt={imageAlt || 'Banner Image'}
                    fill
                    sizes={
                      isSimpleVariant
                        ? '(max-width: 768px) 100vw, 50vw'
                        : '(max-width: 768px) 100vw, 42vw'
                    }
                    className="object-cover object-right"
                    priority
                    loader={customLoader}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
