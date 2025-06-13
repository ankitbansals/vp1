import clsx from 'clsx';
import {
  Carousel,
  CarouselButtons,
  CarouselContent,
  CarouselItem,
} from '../../primitives/carousel';
import { BrandItemProps, FeaturedBrandsProps } from '~/types/brands-banners-categories';
import Link from 'next/link';
import Image from 'next/image';


const BrandItem = ({ logo, url, logoAlt }: BrandItemProps) => {
  const href = typeof url === 'string' ? url : url?.payload?.pathname || '#';

  if (!logo) {
    return (
      <div className="flex h-[200px] w-[200px] items-center justify-center rounded-lg bg-gray-100">
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-[1_0_0] px-2.5 items-start justify-center gap-8 self-stretch rounded-lg bg-white w-full shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={href}
        className="flex h-full w-full items-center justify-center px-1 transition-opacity hover:opacity-90"
        aria-label={`Visit brand`}
      >
        <Image
          src={logo}
          alt={logoAlt || 'Brand logo'}
          className="object-cover w-full h-full"
          loading="lazy"
          width={310}
          height={200}
        />
      </Link>
    </div>
  );
};

export function FeaturedBrands({
  className,
  brands = [],
  viewAllUrl,
  viewAllLabel = 'View all Brands',
}: FeaturedBrandsProps) {
  
  return (
    <section className={clsx('w-full', className)}>
      <div className="relative">
        <Carousel>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Brands</h2>
            <CarouselButtons />
          </div>
          <CarouselContent className="py-4 gap-8 min-w-[104px] ">
            {brands.map((brand, index) => (
              <CarouselItem key={index} className="basis-auto">
                <BrandItem logo={brand?.logo} url={brand?.url?.href} logoAlt={brand?.logoAlt} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {viewAllUrl && (
          <div className="flex items-center justify-center mt-14">
            <Link
              href={
                typeof viewAllUrl === 'string' ? viewAllUrl : viewAllUrl?.payload?.pathname || '#'
              }
              className="rounded-lg flex items-center gap-1.5 border border-[#D5D7DA] bg-white px-4.5 py-3 shadow-[inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_0_rgba(10,13,18,0.05),0_1px_2px_0_rgba(10,13,18,0.05)]"
            >
              {viewAllLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
