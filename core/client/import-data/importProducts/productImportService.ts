import { ProductImportResult, ProductCSVRow, PriceCSVRow, InventoryCSVRow, CreateProductData } from './types';
import { CSVParser } from '../csvParser';
import { ProductMapper } from './productMapper';
import { assignChannelsToProducts, createMultipleProducts } from '../../rest-api/create-product';
import { getCategories } from '../../rest-api/create-category';

interface CSVRow extends Record<string, string | undefined> {
    sku: string;
    name: string;
    description: string;
    length: string;
    width: string;
    height: string;
    weight: string;
    grade: string;
    material: string;
}

export class ProductImportService {
    private productsParser: CSVParser;
    private pricingParser: CSVParser;
    private inventoryParser: CSVParser;

    constructor() {
        this.productsParser = new CSVParser({ requiredFields: ['name_en', 'key'] }, 'product');
        this.pricingParser = new CSVParser({ requiredFields: ['product_key', 'amount'] }, 'price');
        this.inventoryParser = new CSVParser({ requiredFields: ['product_key', 'quantityOnStock'] }, 'inventory');
    }

    async importProducts(
        productsCSV: string,
        pricingCSV?: string,
        inventoryCSV?: string
    ): Promise<ProductImportResult> {
        console.log('🚀 Starting product import process...');
        try {
            console.log('📄 Parsing products CSV...');
            const productsResult = this.productsParser.parse(productsCSV);
            console.log(`✓ Parsed ${productsResult.data?.length || 0} products from CSV`);
            if (productsResult.status === 'error') {
                return {
                    status: 'error',
                    successful: [],
                    failed: [],
                    errors: [{ message: 'Failed to parse products CSV' }]
                };
            }

            // Parse pricing CSV if provided
            console.log('💰 Parsing pricing data...');
            const pricingResult = pricingCSV ? this.pricingParser.parse(pricingCSV) : { status: 'success', data: [] };
            console.log(`✓ Parsed ${pricingResult.data?.length || 0} price entries`);
            if (pricingResult.status === 'error') {
                return {
                    status: 'error',
                    successful: [],
                    failed: [],
                    errors: [{ message: 'Failed to parse pricing CSV' }]
                };
            }
            // Parse inventory CSV if provided
            console.log('📦 Parsing inventory data...');
            const inventoryResult = inventoryCSV ? this.inventoryParser.parse(inventoryCSV) : { status: 'success', data: [] };
            console.log(`✓ Parsed ${inventoryResult.data?.length || 0} inventory entries`);
            if (inventoryResult.status === 'error') {
                return {
                    status: 'error',
                    successful: [],
                    failed: [],
                    errors: [{ message: 'Failed to parse inventory CSV' }]
                };
            }

            // Convert parsed data to typed arrays
            const products = productsResult.data as ProductCSVRow[];
            const pricing = pricingResult.data as PriceCSVRow[];
            const inventory = inventoryResult.data as InventoryCSVRow[];

            if (!products?.length) {
                return {
                    status: 'error',
                    successful: [],
                    failed: [],
                    errors: [{ message: 'No products found in CSV' }]
                };
            }

            try {
                console.log('🔄 Mapping products to BigCommerce format...');
                // Fetch all categories first
                const categories = await getCategories();
                console.log('📊 Creating category name to ID mapping...');
                
                // Create a map of normalized category names (lowercase, no special chars) to actual names
                const categoryNameToId = new Map();
                categories.forEach(cat => {
                    // Store both the exact name and a normalized version
                    categoryNameToId.set(cat.name.toLowerCase(), cat.id);
                    categoryNameToId.set(
                        cat.name.toLowerCase().replace(/[&\s]+/g, ''),
                        cat.id
                    );
                });

                // Map products to BigCommerce format
                const mappedProducts = await ProductMapper.mapProducts( products, pricing, inventory );

                console.log(`✓ Mapped ${mappedProducts.length} products to BigCommerce format`);

                console.log('✨ Validating mapped products...');
                const validationResult = this.validateProducts(mappedProducts);
                console.log(`✓ Validation complete: ${validationResult.successful.length} passed, ${validationResult.failed.length} failed`);

                if (validationResult.status === 'error') {
                    return validationResult;
                }

                console.log('🌐 Creating products in BigCommerce...');
                const createResult = await createMultipleProducts(validationResult.successful);
                console.log(`✓ Creation complete: ${createResult.successfulProducts.length} created, ${createResult.failedProducts.length} failed`);

                return {
                    status: createResult.status === 'success' ? 'success' : 'partial',
                    successful: validationResult.successful,
                    created: createResult.successfulProducts,
                    failed: [
                        ...validationResult.failed,
                        ...createResult.failedProducts.map(failure => ({
                            sku: failure.product,
                            errors: failure.errors
                        }))
                    ]
                };
        } catch (error) {
            // Handle mapping errors
            return {
                status: 'error',
                successful: [],
                failed: products.map(p => ({
                    sku: p.sku,
                    errors: [{ message: error instanceof Error ? error.message : 'Unknown error occurred' }]
                }))
            };
        }
        } catch (error) {
            // Handle any unexpected errors
            return {
                status: 'error',
                successful: [],
                failed: [],
                errors: [{ message: error instanceof Error ? error.message : 'Unknown error occurred' }]
            };
        }
    }

    /**
     * Validate mapped products
     */
    private validateProducts(products: CreateProductData[]): ProductImportResult {
        const successful: CreateProductData[] = [];
        const failed: Array<{ sku: string; errors: Array<{ message: string; field?: string }> }> = [];

        for (const product of products) {
            const errors = this.validateProduct(product);
            
            if (errors.length === 0) {
                successful.push(product);
            } else {
                failed.push({ sku: product.sku, errors });
            }
        }

        return {
            status: failed.length > 0 ? (successful.length > 0 ? 'partial' : 'error') : 'success',
            successful,
            failed
        };
    }

    /**
     * Validate a single product
     */
    private validateProduct(product: CreateProductData): Array<{ message: string; field?: string }> {
        const errors: Array<{ message: string; field?: string }> = [];

        // Required fields
        if (!product.name) errors.push({ message: 'Name is required', field: 'name' });
        if (!product.sku) errors.push({ message: 'SKU is required', field: 'sku' });
        if (!product.price) errors.push({ message: 'Price is required', field: 'price' });
        
        // Type validation
        if (product.price && isNaN(product.price)) {
            errors.push({ message: 'Price must be a number', field: 'price' });
        }
        if (product.sale_price && isNaN(product.sale_price)) {
            errors.push({ message: 'Sale price must be a number', field: 'sale_price' });
        }
        if (product.inventory_level && isNaN(product.inventory_level)) {
            errors.push({ message: 'Inventory level must be a number', field: 'inventory_level' });
        }

        return errors;
    }
}
