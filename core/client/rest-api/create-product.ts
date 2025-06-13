import { getApiUrl, getHeaders } from './config';
import { ProductMapper } from '../import-data/importProducts/productMapper';
import { CreateProductData, CreateProductResult, Product } from '../import-data/importProducts/types';

export type { Product, CreateProductData, CreateProductResult };

export interface ChannelAssignment {
    product_id: number;
    channel_id: number;
}

export interface ChannelAssignmentResult {
    status: 'success' | 'error';
    errors?: Array<{
        message: string;
    }>;
};

export const createProduct = async (data: CreateProductData): Promise<CreateProductResult> => {
    console.log(`📝 Creating product: ${data.name} (SKU: ${data.sku})`);
    try {
        console.log('📬 Sending request to BigCommerce API...');
        const response = await fetch(getApiUrl('/catalog/products'), {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(ProductMapper.mapProductRequestBody(data))
        });

        console.log(`📰 Response status: ${response.status}`);
        if (!response.ok) {
            const errorData = await response.json();
            console.log('❌ API Error Response:', JSON.stringify(errorData, null, 2));
            const errors = errorData.errors || [{ message: errorData.title || errorData.message || 'Failed to create product' }];
            return {
                status: 'error',
                errors
            };
        }

        const result = await response.json();
        const product = result.data;
        return ProductMapper.mapProductResponse(product);
    } catch (error: unknown) {
        console.log('❌ Exception caught:', error);
        if (error instanceof Error) {
            console.log('❌ Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            return { 
                status: 'error', 
                errors: [{ message: error.message }] 
            };
        }

        return { 
            status: 'error', 
            errors: [{ message: 'An unknown error occurred' }] 
        };
    }
}


export const assignChannelsToProducts = async (assignments: ChannelAssignment[]): Promise<ChannelAssignmentResult> => {
    try {
        console.log('📬 Sending request to BigCommerce API...');
        const response = await fetch(getApiUrl('/catalog/products/channel-assignments'), {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(assignments)
        });

        console.log(`📰 Response status: ${response.status}`);
        if (!response.ok) {
            const errorData = await response.json();
            console.log('❌ API Error Response:', JSON.stringify(errorData, null, 2));
            const errors = errorData.errors || [{ message: errorData.title || errorData.message || 'Failed to assign channels' }];
            return {
                status: 'error',
                errors
            };
        }

        console.log('✅ Successfully assigned channels');
        return { status: 'success' };
    } catch (error: unknown) {
        console.log('❌ Exception caught:', error);
        if (error instanceof Error) {
            console.log('❌ Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            return { 
                status: 'error', 
                errors: [{ message: error.message }] 
            };
        }

        return { 
            status: 'error', 
            errors: [{ message: 'An unknown error occurred' }] 
        };
    }
}

export const createMultipleProducts = async (products: CreateProductData[]): Promise<{
    status: 'success' | 'partial' | 'error';
    successfulProducts: Product[];
    failedProducts: Array<{
        product: string;
        errors: Array<{
            message: string;
        }>;
    }>;
}> => {
    console.log(`📋 Starting batch creation of ${products.length} products...`);
    const results: Product[] = [];
  const errors: Array<{
    product: string;
    errors: Array<{ message: string; }>;
  }> = [];

    for (const product of products) {
        console.log(`📓 Processing product: ${product.name} (SKU: ${product.sku})`);
        const result = await createProduct(product);

        if (result.status === 'success') {
            if (result.product) {
                results.push(result.product);
                console.log(`✅ Successfully created product: ${product.name} (SKU: ${product.sku})`);
                const businessUnit = result.product.customFields.edges.find(edge => edge.node.name === 'business_unit')?.node.value;
                const assignments = [{
                    product_id: Number(result.product.entityId),
                    channel_id: businessUnit === "HL"
                                ? Number(process.env.HOME_AND_LIVING_CHANNEL_ID) : Number(process.env.VP_STORE_CHANNEL_ID)
                }];
                console.log('🌐 Assigning channels to products...');
                const assignResult = await assignChannelsToProducts(assignments);
                console.log(`✓ Assignment complete: ${assignResult.status}`);
            }
        } else {
            let errorMessages: Array<{ message: string }> = [];
            if (Array.isArray(result.errors)) {
                errorMessages = result.errors;
            } else {
                errorMessages = [{ message: 'Unknown error occurred' }];
            }
            errors.push({
                product: product.sku,
                errors: errorMessages
            });
            console.log(`❌ Failed to create product: ${product.name} (SKU: ${product.sku})`);
            for (const error of errorMessages) {
                console.log(`   Error: ${error.message}`);
            }
        }
    }

    const finalStatus = errors.length === 0 ? 'success' : 'partial';
    console.log('\n📊 Import Summary:');
    console.log('----------------');
    console.log(`Status: ${finalStatus}`);
    console.log(`Success: ${results.length} products`);
    console.log(`Failed: ${errors.length} products`);

    return {
        status: finalStatus,
        successfulProducts: results,
        failedProducts: errors,
    };
};
