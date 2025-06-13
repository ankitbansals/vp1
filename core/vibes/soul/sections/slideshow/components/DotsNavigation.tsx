import { DotsNavigationProps } from "~/types/slideshow";

export function DotsNavigation({ 
  count, 
  currentIndex, 
  onDotClick, 
  className = '' 
}: DotsNavigationProps) {
  if (count <= 1) return null;

  return (
    <div 
      className={`absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 ${className}`}
      role="tablist"
      aria-label="Slideshow navigation dots"
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onDotClick(index)}
          className={`w-6 sm:w-8 h-1 rounded-sm transition-colors ${
            index === currentIndex 
              ? 'bg-[#E30613]' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          aria-label={`Go to slide ${index + 1}`}
          aria-selected={index === currentIndex}
          role="tab"
        />
      ))}
    </div>
  );
}
