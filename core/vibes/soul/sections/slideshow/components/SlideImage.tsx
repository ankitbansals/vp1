import Image from 'next/image';
import { SlideImageProps } from '~/types/slideshow';

export function SlideImage({ src, alt, className = '' }: SlideImageProps) {
  return (
    <div className={`relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] lg:ml-auto lg:w-full ${className}`}>
      {src ? (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-left"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      ): <div className="w-full h-full bg-gray-200 flex items-center justify-center">Image not found</div>}
    </div>
  );
}
