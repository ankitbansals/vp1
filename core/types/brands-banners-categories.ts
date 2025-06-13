export type FeaturedBrandsProps = {
  className?: string;
  brands: Array<{
    logo?: string;
    url?: any;
    logoAlt?: string;
  }>;
  viewAllUrl?: any;
  viewAllLabel?: string;
};


export interface Category {
    category_id: number;
    name: string;
}
    
export type BrandItemProps = {
  logo?: string;
  logoAlt?: string;
  url?: any;
};

export interface FeaturedProductBannerProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaReference?: any;
  showNewBadge?: boolean;
  badgeLabel?: string;
  badgeVariant?: string;
  className?: string;
  backgroundImage?: string;
  heading?: string;
  cta?: string;
  ctaHref?: string;
  showBadge?: boolean;
  bannerUrl?: string;
}

export interface ImageBannerProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaReference?: any;
  image?: {
    media: {
      file: string;
      title?: string;
    };
  };
  showNewBadge?: boolean;
  badgeLabel?: string;
  badgeVariant?: 'primary' | 'secondary' | 'accent';
  variant?: 'simple' | 'standard';
  className?: string;
  heading?: string;
  cta?: string;
  ctaHref?: string;
  showBadge?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  imageSrc?: string;
}

export interface PromoBannerProps {
  className?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaReference?: any;
  image?: {
    media?: {
      file?: string;
      title?: string;
    };
  };
  showNewBadge?: boolean;
  badgeLabel?: string;
  badgeVariant?: 'primary' | 'secondary' | 'accent';
  variant?: 'simple' | 'standard';
}

export interface PromotionItemProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaReference?: any;
  image?: {
    src?: string;
    alt?: string;
    sizes?: string;
  };
  showNewBadge?: boolean;
  className?: string;
}

export interface PromotionsSectionProps {
  title?: string;
  className?: string;
  promotions?: PromotionItemProps[];
}