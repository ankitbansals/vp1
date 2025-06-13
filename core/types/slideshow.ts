export interface Slide {
    tag?: string;
    tagLink?: any;
    title?: string;
    subtitle?: string;
    discount?: string;
    subDescription?: string;
    ctaText?: string;
    ctaLink?: any;
    imageSrc?: string;
    imageAlt?: string;
    tagDescription?: string;
  }
  
  export interface SlideshowProps {
    slides: Slide[];
    autoPlay: boolean;
    autoPlayInterval: number;
    className?: string;
  }
  
  export interface DotsNavigationProps {
    count: number;
    currentIndex: number;
    onDotClick: (index: number) => void;
    className?: string;
  }
  
  export interface TagBadgeProps {
    tag: string;
    tagLink?: string;
    description: string;
  }
  
  export interface SlideContentProps {
    slide: Slide;
    className?: string;
  }
  
  export interface SlideImageProps {
    src: string;
    alt: string;
    className?: string;
  }
  
  export interface DiscountProps {
    children: React.ReactNode;
    className?: string;
  }