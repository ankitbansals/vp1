import { NextRequest } from 'next/server';
import { CategoryImportService } from '@/client/import-data/importCategories/categoryImportService';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const categoriesFile = formData.get('categories') as File;

        if (!categoriesFile) {
            return Response.json(
                { error: 'Categories file is required' },
                { status: 400 }
            );
        }

        console.log('Reading categories file...');
        const categoriesCsv = await categoriesFile.text();

        // Import categories
        const categoryImporter = new CategoryImportService();
        const categoryMap = await categoryImporter.importCategories(categoriesCsv);

        return Response.json({
            status: 'success',
            message: `Successfully processed ${categoryMap.size} categories`,
            categories: Array.from(categoryMap.entries()).map(([name, id]) => ({ name, id }))
        });
    } catch (error) {
        console.error('Error importing categories:', error);
        return Response.json(
            { error: 'Failed to import categories' },
            { status: 500 }
        );
    }
}
