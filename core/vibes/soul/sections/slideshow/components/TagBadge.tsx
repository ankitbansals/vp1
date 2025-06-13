import Link from 'next/link';
import { TagBadgeProps } from '~/types/slideshow';

export function TagBadge({ tag, tagLink, description }: TagBadgeProps) {
  return (
    <div className="flex items-center">
      <div className="border-[#FCE6E7] border max-w-2xl w-full p-1.5 sm:p-2 text-sm">
        <div className="flex items-center">
          <span className='bg-[#E30613] text-white rounded-full px-4 sm:px-6 py-1 sm:py-1.5 text-sm sm:text-base'>
            {tag}
          </span>
          {tagLink && (
            <Link 
              href={tagLink} 
              className="inline-flex items-center bg-transparent rounded-r-full px-4 sm:px-6 py-1 sm:py-1.5 text-sm sm:text-base text-[#181D27] hover:text-[#E30613] transition-colors"
            >
              <span className="mr-2 font-body font-medium text-md leading-[1.5rem] tracking-normal">
                {description}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 sm:h-5 sm:w-5" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M17.5 12h-15m11.667-4l3.333 4-3.333 4"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
