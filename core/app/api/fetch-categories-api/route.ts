
//THIS SECTION WILL BE IMPLEMENTED BY USING SEARCH ENGINE. IT'S JUST FOR TESTING PURPOSE

import { TARGET_CATEGORIES } from "~/constants";

export async function GET() {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
  const apiToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
  
  try {
    // Validate environment variables
    if (!storeHash || !apiToken) {
      console.warn('Missing BigCommerce credentials, using mock data');
      return [];
    }

    // Fetch categories from BigCommerce API
    const url = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/trees/categories?category_id:in=${TARGET_CATEGORIES}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Auth-Token': apiToken,
        'Accept': 'application/json',
      },
    });

    // Handle non-OK responses
    if (!response.ok) {
      console.warn(`API error: ${response.status} ${response.statusText}, using mock data`);
      return [];
    }

    const data = await response.json();
    
    // Return mock data if response is empty or invalid
    if (!data?.data?.length) {
      console.warn('Empty or invalid API response, using mock data');
      return [];
    }
    
    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
