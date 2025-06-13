import { getApiUrl, getHeaders } from './config';

const currencyCode = process.env.CURRENCY_CODE;
export interface PriceList {
    id: number;
    name: string;
    active?: boolean;
}

export interface CreatePriceListData {
    name: string;
    active?: boolean;
}

interface CreatePriceListResponse {
    data: PriceList;
    meta: Record<string, any>;
}

export type CreatePriceListAssignmentData = {
    price_list_id: number;
    variant_id?: number;     // Either variant_id or sku must be provided
    sku?: string;           // Either variant_id or sku must be provided
    price: number;          // Required: Regular price
    sale_price?: number;    // Optional: Sale price
    retail_price?: number;  // Optional: Retail price (MSRP)
    map_price?: number;     // Optional: Minimum Advertised Price
    bulk_pricing_tiers?: Array<{
        quantity_min: number;   // Required if using bulk pricing
        quantity_max?: number;  // Optional: If not set, applies to all quantities above min
        price: number;          // Required: Price for this tier
        type: 'fixed' | 'discount' | 'percent';  // Required: Type of price adjustment
    }>;
    currency?: string;      // Optional: Defaults to 'USD'
}

export async function getPriceListByName(name: string): Promise<number | null> {
    try {
        const response = await fetch(getApiUrl('/pricelists'), {
            method: 'GET',
            headers: getHeaders()
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            console.error('BigCommerce API Error:', responseData);
            return null;
        }

        const priceList = responseData.data.find((list: any) => list.name === name);
        return priceList ? priceList.id : null;

    } catch (error) {
        console.error('Error getting price list:', error);
        return null;
    }
}

export async function getChannelByKey(storeKey: string): Promise<number | null> {
    try {
        const response = await fetch(getApiUrl('/channels'), {
            method: 'GET',
            headers: getHeaders()
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            console.error('BigCommerce API Error:', responseData);
            return null;
        }

        const channel = responseData.data.find((ch: any) => ch.name === storeKey);
        return channel ? channel.id : null;

    } catch (error) {
        console.error('Error getting channel:', error);
        return null;
    }
}

export async function createPriceList(data: CreatePriceListData): Promise<{ response: Response; data: any }> {
    try {
        const response = await fetch(getApiUrl('/pricelists'), {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            console.error('BigCommerce API Error:', responseData);
        }

        return { response, data: responseData };
    } catch (error) {
        console.error('Error creating price list:', error);
        throw error;
    }
}

export async function createMultiplePriceListAssignments(
    priceListId: number,
    assignments: Omit<CreatePriceListAssignmentData, 'price_list_id'>[]
): Promise<{
    successful: Array<{ sku: string; id: number }>;
    failed: Array<{ sku: string; errors: Array<{ message: string }> }>;
}> {
    try {
        // Format assignments for batch update
        const records = assignments.map(assignment => ({
            sku: assignment.sku,
            price: assignment.price,
            sale_price: assignment.sale_price,
            retail_price: assignment.retail_price,
            map_price: assignment.map_price,
            bulk_pricing_tiers: assignment.bulk_pricing_tiers,
            currency: assignment.currency || currencyCode
        }));

        // Make batch update request

        const response = await fetch(getApiUrl(`/pricelists/${priceListId}/records`), {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(records)
        });

        const data = await response.json();

        // Log the raw response for debugging
        console.log('Raw API response:', {
            status: response.status,
            ok: response.ok,
            data
        });

        if (!response.ok) {
            // If it's a 422 error with SKU not found, log warnings but continue
            if (response.status === 422 && data.errors) {
                const skuErrors = Object.entries(data.errors).filter(([key, value]) => 
                    typeof value === 'string' && (value as string).includes('does not exist')
                );
                
                if (skuErrors.length > 0) {
                    console.warn('Some SKUs were not found:', {
                        totalRecords: records.length,
                        failedCount: skuErrors.length,
                        failedSKUs: skuErrors.map(([key, value]) => ({
                            index: key.split('.')[0],
                            sku: (value as string).match(/sku `([^`]+)`/)?.[1],
                            message: value
                        })).filter(Boolean)
                    });
                    
                    // Return successful records if any
                    if (data.meta && data.meta.saved_records > 0) {
                        return {
                            successful: records.slice(0, data.meta.saved_records).map(record => ({
                                sku: record.sku || '',
                                id: priceListId
                            })),
                            failed: skuErrors.map(([key, value]) => ({
                                sku: (value as string).match(/sku `([^`]+)`/)?.[1] || '',
                                errors: [{ message: typeof value === 'string' ? value : JSON.stringify(value as unknown as string) }]
                            })).filter(Boolean)
                        };
                    }
                }
            }
            
            throw new Error(`Failed to create price list assignments: ${JSON.stringify(data.errors || data)}`);
        }

        // For successful requests, return all assignments as successful
        return {
            successful: records.map(record => ({
                sku: record.sku || '',
                id: priceListId
            })),
            failed: []
        };
    } catch (error: unknown) {
        console.error('Error creating price list assignments:', error);
        return {
            successful: [],
            failed: [{
                sku: 'unknown',
                errors: [{
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }]
            }]
        };
    }
}
