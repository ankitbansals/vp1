import SubCategoryDropdown from './SubCategoryDropdown';
import { DesktopCategoryNavigationProps } from '../../types';
import { useMegaMenuStore } from '~/store/mega-menu-store';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';
import { categories } from '~/data/categoriesData';

const DesktopCategoryNavigation: React.FC<DesktopCategoryNavigationProps> = ({ onCategorySelect }) => {
  const { selectedCategory, openCategory } = useMegaMenuStore();
  return (
    <>
      <div className="hidden bg-white lg:block text-[14px] font-medium">
        <div className="w-full">
          <div className="flex flex-1 items-center overflow-hidden overflow-x-auto border-b border-gray-100 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [::-webkit-scrollbar]:hidden @xs:text-xs">
            <div className="flex items-center self-stretch lg:gap-3 @xs:gap-1">
              {categories.map((category: { name: string }) => (
                <div key={category.name} className="group relative">
                  <button
                    className={`flex flex-col items-start justify-center gap-4 lg:p-3 @xs:p-2 ${
                      selectedCategory === category.name ? 'text-brand-900' : 'text-gray-700 hover:text-error-700'
                    }`}
                    onClick={() => onCategorySelect(category.name)}
                  >
                    {category.name}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 border-x border-brand-700 p-3 @xs:p-1.5" style={{ backgroundColor: '#FCE6E7', borderRight: '0.5px solid #B70E03', borderLeft: '0.5px solid #B70E03' }}>
              <button className="flex items-start text-brand-900 @xs:text-xs">New Arrivals</button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 self-stretch p-3 @xs:p-1.5" style={{ backgroundColor: '#FCE6E7' }}>
              <button className="flex items-start text-brand-900 @xs:text-xs">Offers</button>
            </div>
          </div>
        </div>
      </div>
      {openCategory === selectedCategory ? <SubCategoryDropdown /> : <></>}
    </>
  );
};

export default DesktopCategoryNavigation;
