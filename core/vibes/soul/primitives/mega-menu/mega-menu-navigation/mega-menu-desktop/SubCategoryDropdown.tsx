import { useMegaMenuStore } from '~/store/mega-menu-store';
import { categories } from '~/data/categoriesData';

const SubCategoryDropdown = () => {
  const { selectedCategory, setOpenCategory } = useMegaMenuStore();
  const handleCloseDropdown = () => {
    setOpenCategory('');
  };

  return (
    <div className="absolute left-0 z-50 hidden w-full border-t border-gray-200 bg-white shadow-lg lg:block">
      <div className="p-4 pt-0">
        <div className="pb-4">
          <button
            onClick={handleCloseDropdown}
            className="flex w-full justify-end p-2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="#181D27"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2 border-b border-brand-600 px-4 py-2.5">
            <h2 className="text-lg font-semibold text-brand-700">View All {selectedCategory}</h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g id="arrow-right">
                <path
                  id="Icon"
                  d="M4.16666 10H15.8333M15.8333 10L9.99999 4.16669M15.8333 10L9.99999 15.8334"
                  stroke="#B70E03"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className="flex justify-between gap-6">
          <div className="flex min-w-[800px] flex-1 flex-wrap content-start items-start gap-y-2">
            {categories
              .find((category) => category.name === selectedCategory)
              ?.subcategories?.map((subcategory) => (
                <div key={subcategory} className="w-[200px]">
                  <h3 className="px-[14px] py-2 font-semibold text-brand-700 text-sm">{subcategory}</h3>
                  <ul className="space-y-1.5 px-4 text-gray-600 text-xs">
                    <li>
                      <a href="#" className="py-1">
                        Item 1
                      </a>
                    </li>
                    <li>
                      <a href="#" className="py-1">
                        Item 2
                      </a>
                    </li>
                  </ul>
                </div>
              ))}
            <div></div>
          </div>
          <div className="aspect-[27/26] h-[520px] w-[540px] rounded-lg bg-gradient-to-r from-[#F5C8F5] via-[#DADDFA] to-[#DADDFA]"></div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryDropdown;
