'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { Typography } from '../../primitives/typography';
import ProductCard from '../../primitives/custom-product-card';
import { fetchCategories } from '../../../../lib/makeswift/utils/fetch-categories';
import { fetchProductsByCategory } from '../../../../lib/makeswift/utils/fetch-products-by-category';
import { Category } from '~/types/brands-banners-categories';
import { ProductCardSkeleton } from '../../primitives/custom-product-card/product-card-skeleton';

interface FeaturedCategoriesSectionProps {
  title?: string;
  className?: string;
}

export function FeaturedCategoriesSection({
  title = 'Featured Categories',
  className = '',
}: FeaturedCategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryEntityId, setCategoryEntityId] = useState<number>();
  const [products, setProducts] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  // Fetch products when category changes
  useEffect(() => {
    if (!categoryEntityId) return;

    const loadProducts = async () => {
      setLoading(true);
      const productsData = await fetchProductsByCategory(categoryEntityId);
      setProducts(productsData);
      setLoading(false);
    };

    loadProducts();
  }, [categoryEntityId]);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const categoriesData = await fetchCategories();
        
        // Only reverse if we have data
        if (categoriesData.length > 0) {
          const reversedCategories = [...categoriesData].reverse();
          setCategories(reversedCategories);

          // Set the first category ID if available
          if (reversedCategories.length > 0 && typeof reversedCategories[0]?.category_id === 'number') {
            setCategoryEntityId(reversedCategories[0].category_id);
          }
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className={clsx('', className)}>
      <div className="container mx-auto w-full max-w-screen-2xl">
        <Typography variant="h3" as="h2" className="mb-8 text-center md:text-left">
          {title}
        </Typography>

        {/* Categories Navigation - Show skeleton if categories are loading */}
        <div className="scrollbar-hide mb-8 flex w-full overflow-x-auto border-b border-gray-200">
          <div className="flex min-w-full justify-start space-x-4 md:justify-center md:space-x-8">
            {categoriesLoading
              ? // Render category skeletons while loading
                [...Array(6)].map((_, index) => (
                  <div key={`cat-skeleton-${index}`} className="animate-pulse">
                    <div className="h-8 w-20 rounded-md bg-gray-200"></div>
                  </div>
                ))
              : categories.length > 0
                ? // Render actual categories
                  categories.map((cat) => (
                    <button
                      key={cat.category_id}
                      className={`border-b-2 pb-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                        categoryEntityId === cat.category_id
                          ? 'border-[#E30613] text-[#B70E03]'
                          : 'border-transparent text-gray-500 hover:text-[#B70E03]'
                      }`}
                      onClick={() => {
                        setCategoryEntityId(cat.category_id);
                        params.set('categoryEntityId', cat.category_id.toString());
                      }}
                      type="button"
                    >
                      {cat.name}
                    </button>
                  ))
                : // No categories found
                  [...Array(1)].map((_, index) => (
                    <div key={`empty-${index}`} className="animate-pulse">
                      <div className="h-8 w-20 rounded-md bg-gray-200"></div>
                    </div>
                  ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="min-h-[375px] w-full">
          {loading || categoriesLoading || products.length === 0 ? (
            // Show skeleton loaders while loading or when no products are available
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {[...Array(5)].map((_, index) => (
                <div key={`product-skeleton-${index}`} className="flex justify-center">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            // Render actual products
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product: any) => (
                <div key={product.id} className="flex justify-center">
                  <ProductCard {...product} className="w-full max-w-[280px]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All Button - Only show when data is loaded */}
        {!loading && !categoriesLoading && categories.length > 0 && products.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              className="group flex items-center gap-2 rounded-md border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-800 transition-colors hover:border-[#B70E03]"
              disabled={!categoryEntityId}
            >
              View all {categories.find((c) => c.category_id === categoryEntityId)?.name}
              <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
