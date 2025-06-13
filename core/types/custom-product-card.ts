// Define a type for price objects that might come from state management
export interface PriceObject {
  type?: string;
  currentValue?: string | number;
  previousValue?: string | number;
}

export interface CustomProductCardProps {
  brandName?: string;
  productName?: string;
  rating?: number;
  reviewCount?: number;
  weeklyPrice?: string | number | PriceObject;
  fullPrice?: string | number | PriceObject;
  offerPrice?: string | number | PriceObject;
  inStock?: boolean;
  className?: string;
  imageSrc?: string;
  id?: number;
  link?: string;
}
