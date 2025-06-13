import { string } from "zod";

// CSV Row Types
export interface CSVProductData {
    key: string;
    name: string;
    type: 'physical' | 'digital';
    description: string;
    categories:string[];
    sku: string;
    length: number;
    width: number;
    height: number;
    weight: number;
    price: number;
    sale_price: number;
    page_title: string;
    meta_keywords: string[];
    metaDescription: string;
    custom_url: CustomUrl;
    search_keywords: string;
    inventory_level: number;
    inventory_warning_level: number;
    inventory_tracking: 'none' | 'product' | 'variant';
    availability: 'available' | 'disabled' | 'preorder';
    availability_description: string;
    custom_fields: CustomField[];
    images: Image[];
    _metadata?: {
        lineNumber: number;
        rawData: Record<string, string>;
    };
}

export interface ProductCSVRow extends Record<string, any> {
    key: string;
    name: string;
    'product-type-key': string;
    'slug-en': string;
    'description-en': string;
    categories: string; // JSON string array
    'meta-title': string;
    'meta-description-en': string;
    'meta-keywords-en': string;
    'is-active': string;
    sku: string;
    'allow-user-to-checkout': string;
    'is-hp-product': string;
    colour: string;
    price: number;
    length: string;
    width: string;
    height: string;
    grade: string;
    material: string;
    uom: string;
    brand: string;
    tags: string;
    'max-hp-term': string;
    'vendor-item-code': string;
    mediaURL: string;
    thumbnail: string;
    'default-price': number;
    'business-unit': string;
}

export interface PriceCSVRow {
    key: string;
    product_key: string;
    amount: string;
    sale_amount: string;
    store_key: string;
}

export interface InventoryCSVRow {
    key: string;
    product_key: string;
    quantityOnStock: string;
    restockableInDays: string;
    store_key: string;
}

// Import Result Types
export interface ImportResult<T> {
    status: 'success' | 'error';
    data?: T;
    errors?: Array<{ message: string }>;
}

export interface ProductImportResult {
    created?: Product[];
    status: 'success' | 'error' | 'partial';
    successful: CreateProductData[];
    failed: Array<{
        sku: string;
        errors: Array<{ message: string; field?: string }>;
    }>;
    errors?: Array<{ message: string; field?: string }>;
}

export interface ProductResponse {
    id: string | number;
    name: string;
    sku: string;
    type: 'physical' | 'digital';
    description: string;
    price: number;
    inventory_level: number;
    inventory_warning_level: number;
    inventory_tracking: string;
    availability: string;
    categories: number[];
    custom_fields: Array<{ name: string; value: string; }>;
}

export interface CustomField {
    name: string;
    value: string;
}

export interface CustomUrl {
    url: string;
    is_customized: boolean;
    create_redirect: boolean;
}

export type Product = {
    entityId: string;
    name: string;
    sku: string;
    type: 'physical' | 'digital';
    description?: string;
    prices: {
        price: {
            value: number;
            currencyCode: string;
        };
    };
    inventory: {
        level: number;
        warningLevel: number;
        tracking: string;
    };
    availability: string;
    categories: {
        edges: Array<{
            node: {
                entityId: string;
                name: string;
            };
        }>;
    };
    customFields: {
        edges: Array<{
            node: {
                name: string;
                value: string;
            };
        }>;
    };
};

export type CreateProductResult = {
    status: 'success' | 'error';
    product?: Product;
    errors?: Array<{
        message: string;
    }>;
};

export type Image = {
    is_thumbnail?: boolean;
    sort_order?: number;
    description?: string;
    date_modified?: string;
    id?: number;
    product_id?: number;
    image_url?: string;
    url_thumbnail?: string;
};

export type CreateProductData = {
    name: string;
    type: 'physical' | 'digital';
    description?: string;
    categories?: number[];
    channel_id?: number[];
    sku: string;
    weight?: number;
    price: number;
    images?: Image[];
    sale_price?: number;
    page_title?: string;
    meta_keywords?: string[];
    metaDescription?: string;
    custom_url: CustomUrl;
    search_keywords?: string;
    inventory_level?: number;
    inventory_warning_level?: number;
    inventory_tracking?: 'none' | 'product' | 'variant';
    availability?: 'available' | 'disabled' | 'preorder';
    availability_description?: string;
    custom_fields?: CustomField[];
    length?: number;
    width?: number;
    height?: number;
};

