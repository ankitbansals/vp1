'use client';

import React, { useEffect, useCallback } from 'react';
import { SlideContent } from './components/SlideContent';
import { SlideImage } from './components/SlideImage';
import { DotsNavigation } from './components/DotsNavigation';
import { SlideshowProps } from '~/types/slideshow';

export function Slideshow({ 
  slides, 
  autoPlay, 
  autoPlayInterval ,
  className = '' 
}: SlideshowProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slideCount = slides?.length || 0;
  const showDots = slideCount > 1;
  const slide = slides?.[currentSlide] ;
  const intervalInSeconds = autoPlayInterval * 1000;
  
  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || slideCount <= 1) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, intervalInSeconds);

    return () => clearInterval(interval);
  }, [autoPlay, intervalInSeconds, currentSlide, slideCount]);

  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= slideCount) return;
    setCurrentSlide(index);
  }, [slideCount]);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  if (slideCount === 0) {
    return (
      <div className="bg-[#fffbfb] p-8 text-center">
        <p>No slides to display</p>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full bg-[#fffbfb] ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      <div className="max-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Content Section */}
            <SlideContent slide={slide} />

          {/* Image Section */}
          <SlideImage 
            src={slide?.imageSrc || ''}
            alt={slide?.imageAlt || 'Slide image'}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Dots Navigation */}
      {showDots && (
        <DotsNavigation 
          count={slideCount}
          currentIndex={currentSlide}
          onDotClick={goToSlide}
        />
      )}
    </div>
  );
}
