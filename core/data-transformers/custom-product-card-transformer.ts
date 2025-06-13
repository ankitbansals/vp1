import { CustomProductCardProps } from "~/types/custom-product-card";

export const singleProductCardTransformer = (product: any): CustomProductCardProps => {
  // Handle case where a property might be an object with {type, previousValue, currentValue}
  const extractValue = (value: any) => {
    if (value && typeof value === 'object' && 'currentValue' in value) {
      return value.currentValue;
    }
    return value;
  };

  // Process each field to ensure we don't pass objects with {type, previousValue, currentValue}
  const brandName = extractValue(product.brandName) || extractValue(product.brand) || '';
  const productName = extractValue(product.name) || extractValue(product.title) || '';
  const rating = extractValue(product.rating) || extractValue(product.reviews_rating_sum) || 0;
  const reviewCount = extractValue(product.reviewCount) || extractValue(product.reviews_count) || 0;
  const weeklyPrice = extractValue(product.price) || '';
  const fullPrice = extractValue(product.price) || '';
  const offerPrice = extractValue(product.offerPrice) || '';
  
  // Handle nested properties
  const availabilityStatus = product.availabilityV2?.status 
    ? extractValue(product.availabilityV2.status) 
    : extractValue(product.availability);
  const inStock = availabilityStatus === 'AVAILABLE' || availabilityStatus === 'available';
  
  // Handle image source
  let imageSrc = '';
  if (product?.image?.src) {
    imageSrc = extractValue(product.image.src);
  } else if (product?.images?.[0]?.url_standard) {
    imageSrc = extractValue(product.images[0].url_standard);
  }
  
  // Handle link
  const link = extractValue(product?.href) || 
    (product?.custom_url?.url ? extractValue(product.custom_url.url) : '');

  return {
    brandName,
    productName,
    rating,
    reviewCount,
    weeklyPrice,
    fullPrice,
    offerPrice,
    inStock,
    imageSrc,
    id: extractValue(product.id),
    link,
  };
};

export const customProductCardTransformer = (products: Array<any>): CustomProductCardProps[] => {
  if (!Array.isArray(products)) {
    console.error('Expected products to be an array but received:', products);
    return [];
  }
  
  return products.map((product) => singleProductCardTransformer(product));
};