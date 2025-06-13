import { CreatePriceListData } from '../../rest-api/create-price-list';

export interface PriceListCSVRow {
    product_key: string;
    amount: string;
    sale_amount?: string;
    retail_amount?: string;
    map_amount?: string;
    store_key: string;
    variant_id?: string;
    bulk_pricing?: string; // JSON string of bulk pricing tiers
    currency?: string;
}

export interface PriceListImportResult {
    status: 'success' | 'partial' | 'error';
    successful: Array<{
        sku: string;
        id: number;
    }>;
    failed: Array<{
        sku: string;
        errors: Array<{
            message: string;
            field?: string;
        }>;
    }>;
    errors?: Array<{
        message: string;
        field?: string;
    }>;
    data?: CreatePriceListData[];
}

export interface PriceListAssignmentData {
    variant_id?: number;
    price: number;
    sale_price?: number;
    retail_price?: number;
    map_price?: number;
    bulk_pricing_tiers?: Array<{
        quantity_min: number;
        quantity_max?: number;
        price: number;
        type: 'fixed' | 'discount' | 'percent';
    }>;
    sku?: string;
    currency?: string;
}
