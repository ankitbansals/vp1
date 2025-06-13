import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { categories } from '~/data/categoriesData';
import { MobileCategoryNavigationProps } from '../../types';

const MobileCategoryNavigation: React.FC<MobileCategoryNavigationProps> = ({ onCategorySelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setExpandedCategory(null);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    onCategorySelect(categoryName);
  };

  return (
    <div className="lg:hidden bg-[#AA050E] flex w-full items-center px-4 py-2 text-white @xs:px-3 @xs:py-1.5">
      {/* Hamburger Button */}
      <button 
        onClick={toggleMenu} 
        className="flex items-center gap-1 p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 @xs:h-5 @xs:w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <span className="ml-2 text-base @xs:text-sm">Shop</span>
      </button>

      {/* Mobile Menu Overlay
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-full max-w-[320px] bg-brand-800 @xs:max-w-[280px]">
            Menu Header
            <div className="flex items-center justify-between bg-gray-950 p-4 text-white @xs:p-3">
              <h2 className="text-lg font-medium @xs:text-base">Shop</h2>
              <button onClick={toggleMenu} className="text-white hover:text-gray-200">
                <X size={24} className="@xs:h-5 @xs:w-5" />
              </button>
            </div>

            Categories List
            <div className="h-[calc(100vh-64px)] overflow-y-auto @xs:h-[calc(100vh-56px)]">
              <div className="min-h-full">
                {categories.map((category) => (
                  <div key={category.name}>
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="flex w-full items-center justify-between px-4 py-4 text-left text-white @xs:px-3 @xs:py-3"
                    >
                      <span className="text-base @xs:text-sm">{category.name}</span>
                      <ChevronRight
                        size={20}
                        className={`transform transition-transform @xs:h-4 @xs:w-4 ${
                          expandedCategory === category.name ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {expandedCategory === category.name && (
                      <div className="bg-brand-700 py-2">
                        {category.subcategories.map((subcategory: string) => (
                          <button
                            key={subcategory}
                            onClick={() => {
                              onCategorySelect(category.name);
                              toggleMenu();
                            }}
                            className="w-full px-8 py-3 text-left text-sm text-white hover:bg-brand-700 @xs:px-6 @xs:py-2"
                          >
                            {subcategory}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="bg-brand-700">
                  <button className="flex w-full items-center justify-between px-4 py-4 text-left text-white @xs:px-3 @xs:py-3">
                    <span className="text-base @xs:text-sm">New Arrivals</span>
                  </button>
                </div>
                <div className="bg-brand-700">
                  <button className="flex w-full items-center justify-between px-4 py-4 text-left text-white @xs:px-3 @xs:py-3">
                    <span className="text-base @xs:text-sm">Offers</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default MobileCategoryNavigation;
