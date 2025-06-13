import Link from 'next/link';
import { Discount } from './Discount';
import { TagBadge } from './TagBadge';
import { Slide } from '~/types/slideshow';

interface SlideContentProps {
  slide?: Slide;
  className?: string;
}

export const SlideContent: React.FC<SlideContentProps> = ({ slide, className = '' }) => {
  return (
    <div
      className={`flex flex-col justify-center space-y-4 px-4 sm:space-y-6 sm:px-8 md:px-12 lg:px-32 ${className}`}
    >
      {slide ? (
        <>
          <div className="space-y-3 sm:space-y-4">
            {slide?.tag && (
              <TagBadge
                tag={slide?.tag}
                tagLink={slide?.tagLink}
                description={slide?.tagDescription || 'Description'}
              />
            )}
            <h1 className="text-2xl font-bold text-[#181D27] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              {slide?.title}
            </h1>
            <div className="space-y-2">
              <p className="text-base text-[#1A1A1A] sm:text-lg md:text-xl lg:text-2xl">
                {slide?.subtitle} <Discount> {slide?.discount}</Discount>
              </p>
              {slide?.subDescription && (
                <p className="font-body text-xl leading-relaxed font-normal tracking-normal text-[#717680]">
                  {slide?.subDescription}
                </p>
              )}
            </div>
          </div>

          <Link
            href={slide?.ctaLink || '#'}
            className="inline-flex w-fit items-center space-x-2 rounded-md bg-[#E30613] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c00510] sm:px-6 sm:py-3 sm:text-base"
            aria-label={slide?.ctaText}
          >
            <span>{slide?.ctaText}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </>
      ) : null}
    </div>
  );
};
