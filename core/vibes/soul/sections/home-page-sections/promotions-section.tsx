'use client';

import React from 'react';
import Image from 'next/image';
import { Typography } from '../../primitives/typography';
import { CTALink } from '../../primitives/cta-link';
import { PromotionItemProps, PromotionsSectionProps } from '~/types/brands-banners-categories';

function PromotionItem({
  title,
  description,
  ctaLabel,
  ctaReference,
  image,
  showNewBadge,
  className,
}: PromotionItemProps) {
  const trimmedCtaReference = typeof ctaReference === 'string' ? ctaReference.trim() : '';

  const hasContent = !!(title || description || (ctaLabel && trimmedCtaReference));

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Image Section */}
      <div
        className={`relative w-full ${
          hasContent ? 'h-[400px]' : 'h-full min-h-[400px]'
        } bg-gradient-to-br from-[#F8E4FF] to-[#FFE4F1]`}
      >
        {image?.src ? (
          <Image
            src={image.src}
            alt={image.alt || title || 'Image'}
            fill
            className="object-cover"
            sizes={image.sizes || '100vw'}
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400"
            >
              <path
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      {hasContent && (
        <div className="flex flex-col justify-end gap-6 px-0 py-3">
          <div>
            {title && (
              <div className="mb-4 flex items-center gap-2">
                <Typography
                  as="h3"
                  className="font-display text-text-primary text-[24px] leading-[32px] font-semibold"
                >
                  {title}
                </Typography>
                {showNewBadge && (
                  <span className="rounded-full border border-[#ABEFC6] bg-[#ECFDF3] px-[10px] py-0.5 text-[16px] leading-none text-[#067647]">
                    New
                  </span>
                )}
              </div>
            )}

            {description && (
              <Typography className="font-body text-text-primary line-clamp-2 overflow-hidden text-[16px] leading-[24px] font-normal text-ellipsis">
                {description}
              </Typography>
            )}
          </div>

          {ctaLabel && ctaReference && (
            <CTALink
              label={ctaLabel}
              reference={ctaReference?.href}
              className="font-body inline-flex items-center gap-1.5 text-[16px] leading-[24px] font-semibold text-[#B70E03]"
            >
              <svg
                className="ml-1 h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 8h14M8 1l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </CTALink>
          )}
        </div>
      )}
    </div>
  );
}

export function PromotionsSection({ className = '', promotions }: PromotionsSectionProps) {
  const imageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return (
    <section className={className}>
      <div className="container mx-auto py-4 sm:py-6 md:py-8 lg:py-20">
        <div className="grid grid-cols-1 gap-[63px] min-[320px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {promotions?.map((promotion, index) => (
            <PromotionItem
              key={promotion.title ? promotion.title + index : index}
              {...promotion}
              image={
                promotion.image?.src
                  ? {
                      ...promotion.image,
                      sizes: promotion.image.sizes || imageSizes,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
