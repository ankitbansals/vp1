import { PriceListAssignmentData, PriceListCSVRow } from './types';
import { CreatePriceListData } from '~/client/rest-api/create-price-list';

const currencyCode = process.env.CURRENCY_CODE;

export function mapPriceListData(row: PriceListCSVRow): CreatePriceListData {
    return {
        name: `${row.store_key}-pricelist`,
        active: true
    };
}

export function mapPriceListAssignments(rows: PriceListCSVRow[]): PriceListAssignmentData[] {
    const validAssignments: PriceListAssignmentData[] = [];
    const errors: Array<{ sku: string; error: string }> = [];

    rows.forEach(row => {
        try {
            // Validate SKU
            if (!row.product_key) {
                throw new Error('Product key (SKU) is required');
            }

            // Validate price
            if (!row.amount) {
                throw new Error(`Price is required for product ${row.product_key}`);
            }

            const price = parseFloat(row.amount);
            if (isNaN(price)) {
                throw new Error(`Invalid price format '${row.amount}' for product ${row.product_key}`);
            }
            if (price <= 0) {
                throw new Error(`Price must be greater than 0 for product ${row.product_key}`);
            }

            const assignment: PriceListAssignmentData = {
                sku: row.product_key,
                price: price,
                currency: row.currency ?? currencyCode
            };

            // Add optional fields if they exist
            if (row.sale_amount) {
                const salePrice = parseFloat(row.sale_amount);
                if (!isNaN(salePrice) && salePrice > 0) {
                    assignment.sale_price = salePrice;
                }
            }
            if (row.retail_amount) {
                const retailPrice = parseFloat(row.retail_amount);
                if (!isNaN(retailPrice) && retailPrice > 0) {
                    assignment.retail_price = retailPrice;
                }
            }
            if (row.map_amount) {
                const mapPrice = parseFloat(row.map_amount);
                if (!isNaN(mapPrice) && mapPrice > 0) {
                    assignment.map_price = mapPrice;
                }
            }
            if (row.bulk_pricing) {
                try {
                    const bulkPricing = JSON.parse(row.bulk_pricing);
                    if (Array.isArray(bulkPricing)) {
                        const validTiers = bulkPricing.filter(tier => {
                            const price = tier.amount ?? tier.price;
                            return !isNaN(price) && price > 0 && !isNaN(tier.quantity_min);
                        });
                        if (validTiers.length > 0) {
                            assignment.bulk_pricing_tiers = validTiers.map(tier => ({
                                quantity_min: tier.quantity_min,
                                quantity_max: tier.quantity_max,
                                price: tier.amount ?? tier.price,
                                type: tier.type ?? 'fixed'
                            }));
                        }
                    }
                } catch (e) {
                    console.warn(`Invalid bulk pricing JSON for ${row.product_key}:`, e);
                }
            }

            validAssignments.push(assignment);
        } catch (error) {
            errors.push({
                sku: row.product_key || 'unknown',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Log validation results
    if (errors.length > 0) {
        console.warn('Price list assignment validation errors:', {
            totalRows: rows.length,
            validCount: validAssignments.length,
            errorCount: errors.length,
            errors: errors
        });
    }

    return validAssignments;
}
