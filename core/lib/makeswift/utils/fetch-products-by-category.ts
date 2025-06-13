import { customProductCardTransformer } from '~/data-transformers/custom-product-card-transformer';

// Define a more flexible Product type that matches the transformer output
type Product = {
  id?: number | string | undefined;
  [key: string]: any; // Allow any other properties
};

/**
 * Fetches products by category ID
 * @param categoryId - The ID of the category to fetch products for
 * @returns Promise with products data
 */
export async function fetchProductsByCategory(categoryId: number): Promise<Product[]> {
  if (!categoryId) return [];

  try {
    const response = await fetch(`/api/products-by-category?categoryId=${categoryId}`);
    const data = await response.json();
    return customProductCardTransformer(data.data) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
