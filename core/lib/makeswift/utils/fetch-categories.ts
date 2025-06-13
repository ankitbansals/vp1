// Define the Category interface here since we're not importing it
interface Category {
  category_id: number;
  name: string;
  [key: string]: any; // For any additional properties
}

/**
 * Fetches categories from the API
 * @returns Promise with categories data
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/fetch-categories-api');
    const data = await response.json();
    
    // Handle different response formats
    if (data?.data?.data) return data.data.data;
    if (data?.data) return Array.isArray(data.data) ? data.data : [];
    if (Array.isArray(data)) return data;
    
    console.log('Using empty array as fallback for unexpected data format', data);
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
