import { NextRequest, NextResponse } from 'next/server';
import { ProductImportService } from '~/client/import-data/importProducts/productImportService';

type ImportResponse = {
    status: 'success' | 'error' | 'partial';
    errors?: Array<{ message: string }>;
    data?: any;
};
  
export async function POST(req: NextRequest): Promise<NextResponse<ImportResponse>> {
    try {
        const formData = await req.formData();
        const importService = new ProductImportService();
        const files = {
            products: formData.get('products') as File,
            pricing: formData.get('pricing') as File,
            inventory: formData.get('inventory') as File
        };
    
        // Validate required files
        const missingFiles = Object.entries(files)
            .filter(([_, file]) => !file)
            .map(([name]) => name);
    
        if (missingFiles.length > 0) {
            return NextResponse.json({
                status: 'error',
                errors: [{
                    message: `Missing required CSV files: ${missingFiles.join(', ')}. Please provide as form-data.`
                }]
            }, { status: 400 });
        }
    
        // Read file contents
        const [productsContent, pricingContent, inventoryContent] = await Promise.all([
            files.products.text(),
            files.pricing.text(),
            files.inventory.text()
        ]);
    
        // Import products with pricing and inventory
        const result = await importService.importProducts(
            productsContent,
            pricingContent,
            inventoryContent
        );
    
        return NextResponse.json(result, { 
            status: result.status === 'error' ? 400 : 200
        });
    
    } catch (error) {
        console.error('Error importing products:', error);
        return NextResponse.json({
            status: 'error',
            errors: [{
                message: error instanceof Error ? error.message : 'Failed to import products'
            }]
        }, { status: 500 });
    }
}
  