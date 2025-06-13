import { 
    ProductCSVRow, 
    PriceCSVRow as PricingCSVRow, 
    InventoryCSVRow, 
    CreateProductData, 
    CreateProductResult, 
    Product,
    ProductResponse,
    Image
} from './types';
import { getCategories, getCategory, getCategoryTreeById } from '../../rest-api/create-category';
import type { Category } from '@/client/rest-api/create-category';

const currencyCode = process.env.CURRENCY_CODE ?? 'FJD';
const productType = process.env.PRODUCT_TYPE_KEY as 'physical' | 'digital' ?? 'physical';
  
export class ProductMapper {
    static mapProductRequestBody(data: CreateProductData) {
        return {
            condition: 'New',
            name: data.name,
            type: data.type,
            description: data.description,
            categories: data.categories,
            sku: data.sku,
            weight: Math.min(data.weight || 0, 99999),
            price: data.price,
            sale_price: data.sale_price || 0,
            page_title: data.page_title || data.name,
            meta_keywords: data.meta_keywords || [],
            meta_description: data.metaDescription || '',
            custom_url: {
                ...data.custom_url,
                url: data.custom_url.url
            },
            search_keywords: data.search_keywords || '',
            inventory_level: Math.min(data.inventory_level || 0, 1000000),
            inventory_warning_level: Math.min(data.inventory_warning_level || 0, 1000000),
            inventory_tracking: data.inventory_tracking || 'none',
            availability: data.availability || 'available',
            availability_description: data.availability_description || '',
            custom_fields: data.custom_fields
                ?.filter(field => field.value && field.value.trim() !== '')
                ?.map(field => ({
                    name: field.name,
                    value: field.value
                })) || [],
            dimensions: {
                length: data.length || 0,
                width: data.width || 0,
                height: data.height || 0
            },
            images: data.images?.map(img => ({
                is_thumbnail: img.is_thumbnail || false,
                image_url: img.image_url,
                url_thumbnail: img.url_thumbnail
            })) || []
        };
    }
  
    static mapProductResponse(product: ProductResponse): { status: 'success', product: Product } {
        return {
            status: 'success',
            product: {
                entityId: product.id.toString(),
                name: product.name,
                sku: product.sku,
                type: product.type as 'physical' | 'digital',
                description: product.description,
                prices: {
                    price: {
                        value: Number(product.price) || 0,
                        currencyCode: currencyCode
                    }
                },
                inventory: {
                    level: Number(product.inventory_level) || 0,
                    warningLevel: Number(product.inventory_warning_level) || 0,
                    tracking: product.inventory_tracking || 'none'
                },
                availability: product.availability,
                categories: {
                    edges: product.categories.map(id => ({
                        node: {
                            entityId: id.toString(),
                            name: '' // We don't have category names in the response
                        }
                    }))
                },
                customFields: {
                    edges: product.custom_fields.map(field => ({
                        node: {
                            name: field.name,
                            value: field.value
                        }
                    }))
                }
            }
        };
    }
    static async mapProducts(products: ProductCSVRow[], pricing: PricingCSVRow[], inventory: InventoryCSVRow[]): Promise<CreateProductData[]> {
        // Get all categories first
        const allCategories: Category[] = await getCategories();
        
        interface CategoryInfo {
            id: number;
            name: string;
            treeId: number;
        }
    
        // Create mapping of category names to IDs
        const categoryMap = new Map<string, CategoryInfo>();
        allCategories.forEach((category: Category) => {
            categoryMap.set(category.page_title.toLowerCase(), {
                id: category.category_id,
                name: category.page_title,
                treeId: category.tree_id
            });
        });
    
        console.log(` Found ${categoryMap.size} categories for mapping`);
    
        const mappedProducts = await Promise.all(products.map(async (product) => {
            // Find matching pricing and inventory
            const productPricing = pricing.find(p => p.product_key === product.key);
            const productInventory = inventory.find(i => i.product_key === product.key);
            
            // Map categories - handle both array and comma-separated string formats
            const categories: number[] = [];
            if (product.categories) {
                let cats: string[] = [];
                
                if (Array.isArray(product.categories)) {
                    cats = product.categories;
                } else if (typeof product.categories === 'string') {
                    try {
                        const parsed = JSON.parse(product.categories);
                        cats = parsed.flat().filter(Boolean);
                    } catch (error) {
                        cats = product.categories.split(',').map(c => c.trim());
                    }
                }

                const validCategories = cats.filter(cat => cat && cat.trim());
                
                for (const categoryName of validCategories) {
                    const categoryInfo = categoryMap.get(categoryName.toLowerCase());
                    if (categoryInfo) {
                        categories.push(categoryInfo.id);
                    } else {
                        console.warn(` Category not found: ${categoryName} for product ${product.key}.`);
                    }
                }
            }
            
            if (categories.length === 0) {
                console.warn(` No valid categories found for product ${product.key}`);
            }
            
            // Use custom fields from the product data
            const customFields = product.custom_fields || [];
    
            // Validate required fields
            if (!product.name) {
                throw new Error(`Product name is required (SKU: ${product.sku || 'unknown'})`); 
            }      
    
            const price = Number(product?.price) || 0;
    
            // Map to BigCommerce format
            const mappedProduct: CreateProductData = {
                name: product.name,
                type: productType,  // this could be digital or physical for now always physical
                description: product.description_en || '',
                categories,
                sku: product.sku,
                length: Number(product.length) || 0,
                width: Number(product.width) || 0,
                height: Number(product.height) || 0,
                weight: 0, // Weight not provided in CSV
                price: price,
                sale_price: Number(productPricing?.sale_amount) > 0 ? Number(productPricing?.sale_amount) : price,
                page_title: product.metaTitle || product.name,
                meta_keywords: (product.metaKeywords_en || '').split(',').map((k: string) => k.trim()),
                metaDescription: product.metaDescription_en || '',
                custom_url: {
                    url: `/${product.slug_en || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')}/`,
                    is_customized: true,
                    create_redirect: true
                },
                images: product.images?.filter((image: { image_url?: string }) => image.image_url && image.image_url !== '0' && image.image_url !== '') || [],
                search_keywords: [product.name, product.sku, product.brand || '', product.tags || ''].filter(Boolean).join(', '),
                inventory_level: Number(productInventory?.quantityOnStock) || 0,
                inventory_warning_level: 10,
                inventory_tracking: 'product',
                availability: 'available',
                availability_description: '',
                custom_fields: customFields
            };
    
            return mappedProduct;
        }));
    
        return mappedProducts;
    }
}
  