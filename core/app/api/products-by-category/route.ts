//THIS SECTION WILL BE IMPLEMENTED BY USING SEARCH ENGINE. IT'S JUST FOR TESTING PURPOSE

import { DEFAULT_CATEGORY_ID, DEFAULT_LIMIT } from "~/constants";

export async function GET(req: Request) {
  try {
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
    const apiToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;

    
    
    // Parse categoryId from query params
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || DEFAULT_CATEGORY_ID; 
    const limit = searchParams.get('limit') || DEFAULT_LIMIT; 
        
    // Check if we have valid API credentials
    if (!storeHash || !apiToken) {
      console.log('Missing BigCommerce credentials');
      return new Response(
        JSON.stringify({
          data: []
        }),
        { status: 200 }
      );
    }

    // Attempt to fetch from BigCommerce API
    const url = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products?categories:in=${categoryId}&limit=${limit}&include=images`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Auth-Token': apiToken,
      },
    });

    // Handle API errors
    if (!res.ok) {
      console.log(`API error: ${res.status} ${res.statusText}`);
      return new Response(
        JSON.stringify({
          data: []
        }),
        { status: 200 }
      );
    }

    // Process the API response
    const data = await res.json();
    
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error in products-by-category API:', error);
    return new Response(
      JSON.stringify({
        data:  []
      }),
    );
  }
}
