'use client';
import React from 'react';
import { Typography } from '../../primitives/typography';
import { getBadgeStyles } from '../../lib/get-badge-style';
import { FeaturedProductBannerProps } from '~/types/brands-banners-categories';

function FeaturedProductBanner({
  title,
  heading,
  description,
  ctaLabel,
  cta,
  ctaReference,
  ctaHref,
  showNewBadge,
  showBadge,
  badgeLabel,
  badgeVariant,
  className,
  backgroundImage,
  bannerUrl,
}: FeaturedProductBannerProps) {
  const finalTitle = title || heading;
  const finalCtaLabel = ctaLabel || cta;
  const finalCtaReference = ctaReference || ctaHref;
  const finalShowBadge = showNewBadge !== undefined ? showNewBadge : showBadge;
  const finalBackgroundImage = backgroundImage || bannerUrl;
  return (
    <section className={`container mx-auto w-full pb-20 ${className}`}>
      <div className="mx-auto">
        <div
          className="xs:min-h-[400px] relative min-h-[320px] overflow-hidden object-cover sm:min-h-[500px] md:min-h-[600px]"
          style={{
            backgroundImage: finalBackgroundImage ? `url(${finalBackgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'transparent',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100/80 to-pink-100/80"></div>
          <div className="xs:px-6 absolute inset-0 flex flex-col items-center justify-center px-4 text-center sm:px-8 md:px-32">
            <div className="mb-4 flex items-center gap-2">
              <Typography
                as="h2"
                className="xs:text-2xl text-text-primary text-xl font-medium sm:text-3xl md:text-4xl"
              >
                {finalTitle}
              </Typography>
              {finalShowBadge && badgeLabel && (
                <span
                  className={`font-body inline-flex rounded-full border px-2 py-0.5 text-center text-sm leading-5 font-medium whitespace-nowrap ${getBadgeStyles(badgeVariant)}`}
                >
                  {badgeLabel}
                </span>
              )}
            </div>
            <Typography
              as="p"
              className="xs:text-base text-text-secondary mx-auto mb-8 max-w-2xl text-sm sm:text-lg"
            >
              {description}
            </Typography>

            {finalCtaLabel && finalCtaReference && (
              <button
                type="button"
                className="xs:px-6 xs:py-3 xs:text-base inline-flex items-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700"
              >
                {finalCtaLabel}
                <svg
                  className="xs:w-5 xs:h-5 -mr-1 ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductBanner;
