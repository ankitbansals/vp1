import React from 'react';
import { DiscountProps } from '~/types/slideshow';

export function Discount({ children, className = '' }: DiscountProps) {
  return (
    <span className={`text-[#FF8A00] font-medium ${className}`}>
      {children}
    </span>
  );
}
