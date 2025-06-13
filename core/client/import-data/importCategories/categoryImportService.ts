import Papa from 'papaparse';
import { 
    createCategory,
    createMetafieldForCategory,
    getCategoryMetafields,
    fetchCategoryMetafieldsGraphQL
} from '@/client/rest-api/create-category';
import { CategoryCSVRow } from './types';
import { CategoryMapper } from './categoryMapper';

export class CategoryImportService {
    async importCategories(csvContent: string): Promise<Map<string, number>> {
        console.log('📂 Starting category import...');

        // Parse CSV
        console.log('📖 Parsing CSV content...');
        // First validate we have content
        if (!csvContent.trim()) {
            throw new Error('CSV content is empty');
        }

        // First parse the headers to get correct column names
        const headerRow = csvContent.split('\n')[0];
        if (!headerRow) {
            throw new Error('CSV file has no headers');
        }

        const headers = headerRow.split(',').map(h => h.trim());
        console.log('Found headers:', headers);

        const parseResult = Papa.parse<Record<string, string>>(csvContent, {
            header: true,
            skipEmptyLines: true,
            delimiter: ',', // Use comma as delimiter
            transform: (value) => value.trim(),
            transformHeader: (header) => header.trim() // Clean up headers
        });

        // Log any parse errors with detailed information
        if (parseResult.errors && parseResult.errors.length > 0) {
            console.log('❌ Found parsing errors:');
            parseResult.errors.forEach((error: Papa.ParseError, index: number) => {
                console.log(`Error ${index + 1}:`);
                console.log(`  Row: ${error.row || 'unknown'}`);
                console.log(`  Type: ${error.code || 'unknown'}`);
                console.log(`  Message: ${error.message || 'unknown'}`);
                if (error.index !== undefined) {
                    const line = csvContent.split('\n')[error.row ? error.row - 1 : 0] || '';
                    console.log(`  Line content: ${line}`);
                    console.log(`  Position: ${error.index}`);
                }
            });
        }

        // Log the parsed headers
        console.log('📒 CSV Headers:', parseResult.meta.fields);

        // Only throw if all rows failed to parse
        if (parseResult.errors.length > 0 && !parseResult.data.length) {
            console.error('❌ All rows failed to parse');
            throw new Error('Failed to parse categories CSV - no valid rows found');
        }

        // Validate and transform the data
        const categories = parseResult.data.map((row: Record<string, string>, index: number) => {
            // Log the first few rows for debugging
            if (index < 3) {
                console.log(`Row ${index + 1}:`, row);
            }

            // Validate required fields
            if (!row.key) {
                throw new Error(`Row ${index + 1} is missing required 'key' field`);
            }
            if (!row.name_en) {
                throw new Error(`Row ${index + 1} is missing required 'name_en' field`);
            }

            // Map CSV fields to our expected format
            return {
                key: row.key,
                name_en: row.name_en,
                parent_category_key: row.parent_category_key || '',
                slug_en: row.slug_en || row.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                description_en: row.description_en || '',
                metaTitle: row.metaTitle || row.name_en,
                metaDescription: row.metaDescription || '',
                metaKeywords: row.metaKeywords_en || '',
                isActive: row.isActive?.toLowerCase() === 'true',
                isBrandCategory: row.isBrandCategory?.toLowerCase() === 'true'
            } as CategoryCSVRow;
        });

        console.log(`✅ Successfully parsed ${categories.length} categories`);

        // Create categories in BigCommerce
        console.log('🌐 Creating categories in BigCommerce...');
        const categoryMap = new Map<string, number>();

        try {
            console.log('🎯 Starting category import...');
            
            // First, create parent categories
            // console.log("categories: ", categories);
            
            const parentCategories = categories.filter(c => !c.parent_category_key);
            console.log(`🔍 Found ${parentCategories.length} parent categories`);

            // Process parent categories first
            for (const parent of parentCategories) {
                const mappedParent = CategoryMapper.mapCategory(parent);
                const category = await createCategory(mappedParent);
                if (category) {
                    categoryMap.set(parent.key, category.category_id);
                    console.log(`✅ Created parent category: ${category.name} (ID: ${category.category_id})`);
                }
            }

            // Stage 2: Create child categories
            const childCategories = categories.filter(c => c.parent_category_key);
            console.log(`🔍 Found ${childCategories.length} child categories`);

            // Process child categories
            for (const child of childCategories) {
                const parentKey = child.parent_category_key!;
                if (categoryMap.has(parentKey)) {
                    
                    const mappedChild = CategoryMapper.mapCategory(child);
                    const parentId = categoryMap.get(parentKey)!;
                    
                    // Create child category with parent ID - tree ID will be inherited from parent
                    const category = await createCategory(mappedChild, parentId);
                    if (category) {
                        categoryMap.set(child.key, category.category_id);
                        console.log(`✅ Created child category: ${category.name} (ID: ${category.category_id})`);
                    }
                }
            }

            // Stage 3: Create grandchild categories and deeper levels
            // This will be handled recursively since we're using the same createCategory function
            // with the parentMap to look up parent IDs and tree IDs

            // Process metafields for all categories
            const metafields = CategoryMapper.mapCategoriesMetafields(categories);
            for (const [key, fields] of Object.entries(metafields)) {
                const category = categories.find(c => c.key === key);
                if (category && categoryMap.get(key)) {
                    // Ensure permission_set is properly typed
                    const typedFields = fields.map(field => ({
                        ...field,
                        permission_set: field.permission_set as 'read' | 'write' | 'app_only' | 'read_and_sf_access'
                    }));
                    await createMetafieldForCategory(categoryMap.get(key)!, typedFields);
                }
            }

            console.log('🎯 Category import completed successfully!');
            return categoryMap;
        } catch (error) {
            console.error('❌ Error importing categories:', error);
            throw error;
        }
    }
}
