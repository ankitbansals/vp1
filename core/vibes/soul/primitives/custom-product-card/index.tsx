'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Typography } from '../typography';
import { CustomProductCardProps, PriceObject } from '~/types/custom-product-card';
import Image from 'next/image';

// Helper function to format price values for display
const formatPrice = (price: string | number | PriceObject | undefined): string => {
  if (typeof price === 'string') {
    return price.includes("A$") ? price.replace('A$', '') : price;
  } else if (typeof price === 'number') {
    return price.toString();
  } else if (price && typeof price === 'object') {
    const priceObj = price as unknown as PriceObject;
    const value = priceObj.currentValue || priceObj.previousValue;
    if (typeof value === 'string') {
      return value.includes("A$") ? value.replace('A$', '') : value;
    } else if (typeof value === 'number') {
      return value.toString();
    }
  }
  return '';
};

const ProductCard: React.FC<CustomProductCardProps> = ({
  brandName = '',
  productName,
  rating = 0,
  reviewCount = 0,
  weeklyPrice = '',
  fullPrice = '',
  offerPrice = '',
  inStock = false,
  imageSrc = '',
  className = '',
  id = 0,
  link = '#',
}) => {
  // Format price values for display
  const formattedWeeklyPrice = formatPrice(weeklyPrice);
  const formattedFullPrice = formatPrice(fullPrice);
  const formattedOfferPrice = formatPrice(offerPrice);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    if (!isAddingToCart && quantity === 0) {
      setIsAddingToCart(true);
      setTimeout(() => {
        setIsAddingToCart(false);
        setQuantity(1);
      }, 1000);
    }
  };

  return (
    <div 
      className={`relative bg-white min-w-[205px] max-h-[444px] rounded overflow-hidden h-full flex flex-col w-full p-0 m-0 ${isHovered ? 'border-red-600' : 'border-gray-200'} border transition-colors duration-200 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link href={link} className="relative h-[200px] w-full overflow-hidden p-0 m-0 block">
        {imageSrc !== '' ?
          <Image 
            src={imageSrc} 
            alt={productName || 'Product Image'} 
            className='w-full h-full object-contain' 
            width={310}
            height={445}
          />
          :
          <div className="w-full h-full flex items-center justify-center bg-brand-50">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          }
      </Link>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Rating and Stock */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
          </div>
          {inStock && (
            <span className="text-sm font-medium text-success-600">
              In Stock
            </span>
          )}
        </div>

        {/* Brand Name */}
        <Typography as="p" className="text-sm text-gray-500 mb-1">
          {brandName}
        </Typography>

        {/* Product Name */}
        <Typography as="h3" className="text-base text-gray-900 font-medium line-clamp-2 mb-2">
          {productName}
        </Typography>

        {/* Color Options */}
        <div className="flex items-center gap-1 mb-2">
          <div className="w-4 h-4 rounded-full bg-gray-200"></div>
          <div className="w-4 h-4 rounded-full bg-pink-200"></div>
          <div className="w-4 h-4 rounded-full bg-purple-200"></div>
          <span className="text-sm text-gray-500 ml-1">+5</span>
        </div>

      </div>
      <div className="bg-gray-50 ">
        {/* Price and Cart */}
        <div className="mt-auto">
          {formattedOfferPrice && !isAddingToCart && !quantity && (
            <div className="flex flex-col">
              <div className="flex items-start">
                <div className="bg-red-600 text-white text-sm font-medium px-2 py-1">
                  Save <span className="font-bold">${formattedOfferPrice}</span>
                </div>
                <div className="text-sm text-gray-500 ml-2 mt-1">
                  Full Price: <span className="text-gray-600">${formattedFullPrice}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 line-through ml-[4.5rem]">
                ${formattedFullPrice}
              </div>
            </div>
          )}
          <div className="flex items-center p-3 justify-between relative">
            {!isAddingToCart && !quantity && (
              <>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">$</span>
                  <span className="text-2xl font-bold text-gray-900">{formattedWeeklyPrice}</span>
                  <span className="text-sm text-gray-600 ml-1">/ week</span>
                  <svg className="w-4 h-4 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transition-colors"
                  onClick={handleAddToCart}
                  aria-label="Add to cart"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    <path d="M20 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </button>
              </>
            )}
            {isAddingToCart ? (
              <div className="w-full flex flex-col items-center justify-center">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 24 24" className="animate-spin text-red-600">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Adding to Cart</span>
              </div>
            ) : quantity > 0 ? (
              <div className="w-full flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-red-600 text-white text-2xl font-medium hover:bg-red-700 transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="w-10 text-center">
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-full text-center text-base font-medium bg-transparent focus:outline-none"
                    aria-label="Quantity"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-red-600 text-white text-2xl font-medium hover:bg-red-700 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
