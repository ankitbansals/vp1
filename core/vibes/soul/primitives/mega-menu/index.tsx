'use client'
// @ts-ignore
import * as React from 'react';
// import { usePathname } from 'next/navigation';
import DesktopCategoryNavigation from './mega-menu-navigation/mega-menu-desktop';
import MobileCategoryNavigation from './mega-menu-navigation/mega-menu-mobile';
import { useMegaMenuStore } from '~/store/mega-menu-store';

const CategoryNavigation: React.FC = () => {
  // const pathname = usePathname();
  const { setOpenCategory, openCategory, setSelectedCategory } = useMegaMenuStore();

  const handleCategoryClick = (categoryName: string) => {
    if (openCategory === categoryName) {
      setOpenCategory('');
    } else {
      setOpenCategory(categoryName);
    }
    setSelectedCategory(categoryName);
  };

  // if (!pathname?.includes('home/category')) {
  //   return null;
  // }

  return (
    <>
      {/* Mobile Navigation */}
      <MobileCategoryNavigation onCategorySelect={handleCategoryClick} />

      {/* Desktop Navigation */}
      <DesktopCategoryNavigation onCategorySelect={handleCategoryClick} />
    </>
  );
};

export default CategoryNavigation;