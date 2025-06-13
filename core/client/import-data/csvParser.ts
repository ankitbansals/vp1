import { parse, Options } from 'csv-parse/sync';
import { PriceCSVRow, InventoryCSVRow, CSVProductData } from './importProducts/types';
// import { CategoryCSVRow } from './importCategories/types';

export interface CSVParserOptions {
    columns?: boolean | string[];
    delimiter?: string;
    requiredFields?: string[];
    type?: 'product' | 'price' | 'inventory';
}

export interface ProductCSVRow {
    key: string;
    sku: string;
    name: string;
    description: string;
    categories: string;
    custom_fields?: string;
}

export interface ImportResult<T> {
    status: 'success' | 'error' | 'partial';
    data?: T;
    errors?: Array<{
        message: string;
        line?: number;
        field?: string;
    }>;
}

export class CSVParseError extends Error {
    constructor(
        message: string,
        public line?: number,
        public field?: string
    ) {
        super(message);
        this.name = 'CSVParseError';
    }
}

export class CSVParser {
    private parseOptions: Options;
    private requiredFields: string[] = [];
    private type: 'product' | 'price' | 'inventory' = 'product';

    constructor(options?: CSVParserOptions, type?: 'product' | 'price' | 'inventory') {
        this.parseOptions = {
            columns: options?.columns || true,
            skip_empty_lines: true,
            trim: true,
            delimiter: options?.delimiter || ','
        };
        if (options?.requiredFields) {
            this.requiredFields = options.requiredFields;
        }
        // Allow type to be specified either in options or as second parameter
        this.type = type || options?.type || 'product';
    }

    private validateRequiredFields(row: Record<string, string>, lineNumber: number): void {
        for (const field of this.requiredFields) {
            if (!row[field]) {
                throw new CSVParseError(`Missing required field: ${field}`, lineNumber, field);
            }
        }
    }

    public parse<T>(csvContent: string): ImportResult<T[]> {
        try {
            // Parse CSV content
            const records = parse(csvContent, this.parseOptions) as Record<string, string>[];
            const results: any[] = [];
            const errors: ImportResult<void>['errors'] = [];
            records.forEach((row, index) => {
                try {
                    // Validate required fields
                    this.validateRequiredFields(row, index + 2);

                    const result = this.type === 'product' ? this.mapRowToProduct(row, index + 2) :
                                    this.type === 'price' ? this.mapRowToPrice(row, index + 2) :
                                    this.mapRowToInventory(row, index + 2);
                    results.push(result);
                } catch (error) {
                    if (error instanceof CSVParseError) {
                        errors.push({
                            message: error.message,
                            line: error.line || index + 2,
                            field: error.field
                        });
                    } else {
                        errors.push({
                            message: error instanceof Error ? error.message : 'Unknown error',
                            line: index + 2
                        });
                    }
                }
            });
            if (errors.length > 0 && results.length === 0) {
                return {
                    status: 'error',
                    errors
                };
            }
            return {
                status: errors.length > 0 ? 'partial' : 'success',
                data: results,
                errors: errors.length > 0 ? errors : undefined
            };
        } catch (error) {
            return {
                status: 'error',
                errors: [{
                    message: error instanceof Error ? error.message : 'Failed to parse CSV file'
                }]
            };
        }
    }

    private mapRowToPrice(row: Record<string, string>, lineNumber: number): PriceCSVRow {
        try {
            this.validateRequiredFields(row, lineNumber);
            return {
                key: row['key'] || '',
                product_key: row['product_key'] || '',
                amount: row['amount'] || '0',
                sale_amount: row['sale_amount'] || '',
                store_key: row['store_key'] || ''
            };
        } catch (error) {
            if (error instanceof CSVParseError) {
                throw error;
            } else {
                throw new CSVParseError(`Failed to map row to price: ${error instanceof Error ? error.message : 'Unknown error'}`, lineNumber);
            }
        }
    }

    private mapRowToInventory(row: Record<string, string>, lineNumber: number): InventoryCSVRow {
        try {
            this.validateRequiredFields(row, lineNumber);
            
            return {
                key: row['key'] || '',
                product_key: row['product_key'] || '',
                quantityOnStock: row['quantityOnStock'] || '0',
                restockableInDays: row['restockableInDays'] || '0',
                store_key: row['store_key'] || ''
            };
        } catch (error) {
            if (error instanceof CSVParseError) {
                throw error;
            } else {
                throw new CSVParseError(`Failed to map row to inventory: ${error instanceof Error ? error.message : 'Unknown error'}`, lineNumber);
            }
        }
    }

    private mapRowToProduct(row: Record<string, string>, lineNumber: number): CSVProductData {
        try {
            // Parse categories from JSON string
            let categories: string[] = [];
            try {
                if (row['categories']) {
                    // Clean up the string before parsing
                    const cleanCategories = row['categories'].trim()
                        .replace(/\s*,\s*/g, ',') // Normalize commas
                        .replace(/\s+/g, ' ') // Normalize whitespace
                        .trim();

                    // Handle JSON array format
                    try {
                        // First check if it's a string containing JSON arrays
                        if (cleanCategories.includes('[') && cleanCategories.includes(']')) {
                            // Split by comma and parse each JSON array
                            const parsedCategories = cleanCategories.split(',').map(str => {
                                try {
                                    return JSON.parse(str.trim());
                                } catch {
                                    return str.trim();
                                }
                            });
                            
                            // Flatten and clean the results
                            categories = parsedCategories.flat().filter(Boolean).map(cat => 
                                typeof cat === 'string' ? cat.trim() : cat
                            );
                        } else {
                            // Handle simple comma-separated string
                            categories = cleanCategories.split(',').filter(Boolean).map(cat => 
                                cat.trim()
                            );
                        }
                    } catch (error) {
                        console.error('Error parsing categories:', error);
                        // Fallback to simple split
                        categories = cleanCategories.split(',').filter(Boolean).map(cat => 
                            cat.trim()
                        );
                    }
                }
            } catch (error) {
                console.error('Error processing categories:', error);
                // Use empty array if parsing fails
            }

            // Validate required fields first
            this.validateRequiredFields(row, lineNumber);

            // Get fields after validation (name_en is guaranteed to exist due to validation)
            const name = row['name_en'] || '';
            const description = row['description-en'] || name;
            const slug = row['slug-en'] || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const key = row['key'] || '';
            const mediaUrl = row['mediaURL'];
            const thumbnail = row['thumbnail'];


            // Map all fields from CSV to product data
            const product: CSVProductData = {
                name,
                type: 'physical' as const,
                sku: row['sku'] || '', // Use SKU from CSV
                description,
                categories,
                price: parseFloat(row['default-price'] || '0'), // Will be set from pricing CSV
                sale_price: 0, // Will be set from pricing CSV
                length: parseFloat(row['length'] || '0'),
                width: parseFloat(row['width'] || '0'),
                height: parseFloat(row['height'] || '0'),
                weight: parseFloat(row['weight'] || '0'),
                inventory_level: 0, // Will be set from inventory CSV
                inventory_warning_level: 10, // Default warning level
                inventory_tracking: 'product',
                availability: row['is-active']?.toLowerCase() === 'true' ? 'available' : 'disabled',
                availability_description: '',
                page_title: row['meta-title'] || name,
                meta_keywords: row['metaKeywords-en']?.split(',').map(k => k.trim()) || [],
                metaDescription: row['meta-description-en'] || description,
                custom_url: {
                    url: row['slug-en'] || slug,
                    is_customized: true,
                    create_redirect: true
                },
                images: mediaUrl && mediaUrl !== '0' ? [{
                    image_url: mediaUrl,
                    is_thumbnail: true,
                    url_thumbnail: thumbnail && thumbnail !== '0' ? thumbnail : mediaUrl
                }] : [],
                search_keywords: [name, row['sku'], row['brand'] || '', row['tags'] || ''].filter(Boolean).join(', '),
                key,
                custom_fields: (() => {
                    // Helper function to ensure we get a string value
                    const getValue = (key: string): string => {
                        const value = row[key];
                        return value !== undefined && value !== null ? String(value) : '';
                    };

                    const fields = [
                        { name: 'key', value: key },
                        { name: 'allow_user_to_checkout', value: getValue('allow-user-to-checkout') },
                        { name: 'is_hp_product', value: getValue('is-hp-product') },
                        { name: 'colour', value: getValue('colour') },
                        { name: 'grade', value: getValue('grade') },
                        { name: 'material', value: getValue('material') },
                        { name: 'uom', value: getValue('uom') },
                        { name: 'brand', value: getValue('brand') },
                        { name: 'tags', value: getValue('tags') },
                        { name: 'max_hp_term', value: getValue('max-hp-term') },
                        { name: 'vendor_item_code', value: row['vendor-item-code'] || '' },
                        { name: 'media_urls', value: getValue('mediaUrls') },
                        { name: 'is_active', value: getValue('is-active') },
                        { name: 'product_type_key', value: getValue('product-type-key') },
                        { name: 'business_unit', value: getValue('business-unit') },
                    ];
                    return fields;
                })(),
                _metadata: {
                    lineNumber,
                    rawData: { ...row }
                }
            };

            return product;
        } catch (error) {
            if (error instanceof CSVParseError) {
                throw error;
            } else {
                throw new CSVParseError(`Failed to map row to product: ${error instanceof Error ? error.message : 'Unknown error'}`, lineNumber);
            }
        }
    }
}
