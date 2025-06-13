import { CreateCategoryData } from '@/client/rest-api/create-category';
import { CategoryCSVRow } from './types';

interface Metafield {
    namespace: string;
    key: string;
    value: string;
    permission_set: string;
}

export class CategoryMapper {
    /**
     * Maps a single CSV row to CreateCategoryData format
     */
    static mapCategory(category: CategoryCSVRow): CreateCategoryData {
        return {
            name: category.name_en,
            description: category.description_en || '',
            parent_id: category.parent_category_key ? Number(category.parent_category_key) : undefined,
            is_visible: category.isActive,
            page_title: category.metaTitle || category.name_en,
            meta_description: category.metaDescription || '',
            meta_keywords: category.metaKeywords_en ? category.metaKeywords_en.split(',').map(k => k.trim()) : [],
            key: category.key
        };
    }

    /**
     * Maps CSV row to metafield data
     */
    static mapMetafields(category: CategoryCSVRow): Metafield[] {
        return [
            {
                namespace: 'custom',
                key: 'is_brand_category',
                value: category.isBrandCategory ? 'true' : 'false',
                permission_set: 'read_and_sf_access'
            },
            {
                namespace: 'custom',
                key: 'is_active',
                value: category.isActive ? 'true' : 'false',
                permission_set: 'read_and_sf_access'
            }
        ];
    }

    /**
     * Maps an array of CSV rows to CreateCategoryData format
     */
    static mapCategories(categories: CategoryCSVRow[]): CreateCategoryData[] {
        console.log(`📓 Mapping ${categories.length} categories...`);
        
        // First, create a map of categories by key for easy lookup
        const categoryMap = new Map<string, CategoryCSVRow>();
        categories.forEach(category => categoryMap.set(category.key, category));

        // Process parent categories first (those with no parent_category_key)
        const parentCategories = categories.filter(c => !c.parent_category_key);
        const childCategories = categories.filter(c => c.parent_category_key);

        // Map parent categories
        const mappedCategories: CreateCategoryData[] = [];
        const parentCategoryMap = new Map<string, number>(); // Store parent category keys and their IDs
        
        // Process parent categories first
        parentCategories.forEach(parent => {
            const mappedParent = CategoryMapper.mapCategory(parent);
            mappedCategories.push(mappedParent);
            // Store parent category key for later use
            parentCategoryMap.set(parent.key, 0); // Will be updated with actual ID after creation
        });

        // Process child categories
        childCategories.forEach(child => {
            const parentKey = child.parent_category_key!;
            const parent = categoryMap.get(parentKey);
            if (parent) {
                const mappedChild = CategoryMapper.mapCategory(child);
                // If we have the parent ID from previous mapping, use it
                if (parentCategoryMap.get(parentKey) !== undefined) {
                    mappedChild.parent_id = parentCategoryMap.get(parentKey);
                }
                mappedCategories.push(mappedChild);
            }
        });

        return mappedCategories;
    }

    /**
     * Maps an array of CSV rows to their metafield data
     */
    static mapCategoriesMetafields(categories: CategoryCSVRow[]): Record<string, Metafield[]> {
        return categories.reduce((acc: Record<string, Metafield[]>, category: CategoryCSVRow) => {
            acc[category.key] = CategoryMapper.mapMetafields(category);
            return acc;
        }, {} as Record<string, Metafield[]>);
    }
}
