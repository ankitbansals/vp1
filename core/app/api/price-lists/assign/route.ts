import { NextResponse } from 'next/server';
import { PriceListAssignmentsImportService } from '~/client/import-data/importPriceLists/priceListImportService';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: 'CSV file is required' },
                { status: 400 }
            );
        }

        // Read CSV content
        const csvContent = await file.text();

        // Create a new instance of PriceListAssignmentsImportService
        const importService = new PriceListAssignmentsImportService();

        // Import price list assignments
        const result = await importService.importPriceListAssignments(csvContent);

        // Return the result with appropriate status code
        return NextResponse.json(result, {
            status: result.status === 'error' ? 400 : 200
        });

    } catch (error) {
        console.error('Error in price list assignment:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to process price assignments',
                status: 'error'
            },
            { status: 500 }
        );
    }
}
