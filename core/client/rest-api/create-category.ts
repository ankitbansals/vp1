import { getApiUrl, getHeaders } from './config';
import { client } from '~/client';
import { graphql, VariablesOf } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

export interface CreateCategoryData {
    name: string;
    description?: string;
    parent_id?: number;
    parent_category_key?: string;
    key: string;  // Added key field to identify the category
    page_title?: string;
    meta_keywords?: string[];
    meta_description?: string;
    is_visible?: boolean;
}

export interface Category {
    id: number;
    category_id: number;
    name: string;
    description: string;
    page_title: string;
    meta_keywords: string[];
    meta_description: string;
    is_visible: boolean;
    tree_id: number;
    parent_id: number;
    key: string;
    url: {
        path: string;
        is_customized: boolean;
    };
}

interface CreateCategoryResponse {
    data: Category[];
    meta: Record<string, any>;
}

interface GetCategoriesResponse {
    data: Category[];
    meta: {
        pagination: {
            total: number;
            count: number;
            per_page: number;
            current_page: number;
            total_pages: number;
            links: {
                next?: string;
                current: string;
            };
        };
    };
}

export interface Metafield {
    namespace: string;
    key: string;
    value: string;
    permission_set: 'read' | 'write' | 'app_only' | 'read_and_sf_access';
}

async function fetchCategoriesPage(page: number): Promise<GetCategoriesResponse> {
    const response = await fetch(getApiUrl(`/catalog/trees/categories?page=${page}&limit=250`), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch categories: ${JSON.stringify(errorData)}`);
    }

    return response.json();
}

export async function getCategories(): Promise<Category[]> {
    console.log('📂 Fetching categories from BigCommerce...');
    try {
        const allCategories: Category[] = [];
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
            console.log(`📓 Fetching categories page ${currentPage}...`);
            const result = await fetchCategoriesPage(currentPage);
            allCategories.push(...result.data);

            // Check if there are more pages
            hasMorePages = result.meta.pagination.current_page < result.meta.pagination.total_pages;
            currentPage++;
        }

        console.log(`✅ Successfully fetched ${allCategories.length} categories`);
        
        // Create a tree structure for better visibility
        const categoryTree = new Map<number, { name: string; path: string; parent_id: number }>();
        allCategories.forEach(cat => {
            categoryTree.set(cat.category_id, { 
                name: cat.name,
                path: cat.url.path,
                parent_id: cat.parent_id
            });
        });

        console.log('📁 Available BigCommerce Categories:');
        console.log('----------------------------------------');
        categoryTree.forEach((cat, id) => {
            const parentInfo = cat.parent_id ? ` (Parent: ${categoryTree.get(cat.parent_id)?.name || 'unknown'})` : '';
            console.log(`- ${cat.name} (ID: ${id})${parentInfo} [${cat.path}]`);
        });
        console.log('----------------------------------------');

        return allCategories;
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        throw error;
    }
}

export async function getCategory(categoryId: number): Promise<Category | null> {
    try {
        const response = await fetch(getApiUrl(`/catalog/trees/categories/${categoryId}`), {
            method: 'GET',
            headers: getHeaders()
        });
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error getting category:', error);
        return null;
    }
}

export async function getCategoryTreeById(treeId: number): Promise<{ id: number; name: string; channels: number[] } | null> {
    try {
        const response = await fetch(getApiUrl(`/catalog/trees`), {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Failed to fetch category tree: ${JSON.stringify(errorData)}`);
            return null;
        }
        
        const trees = await response.json();
        const tree = trees.data.find((tree: any) => tree.id === treeId);
        return tree;
    } catch (error) {
        console.error('Error getting category tree:', error);
        return null;
    }
}

export async function createCategory(data: CreateCategoryData, parentId?: number): Promise<Category | null> {
    try {
        // Determine tree ID based on category type
        let treeId: number;
        if (data.key.startsWith('home_and_living')) {
            // For parent categories with home_and_living prefix
            treeId = parseInt(process.env.HOME_AND_LIVING_CATEGORY_TREE_ID || '3');
        } else {
            // Default to VP_STORE_CATEGORY_TREE_ID for other parent categories
            treeId = parseInt(process.env.VP_STORE_CATEGORY_TREE_ID || '2');
        }

        // Use the provided parentId if available, otherwise get from data
        const finalParentId = parentId || data.parent_id || 0;
        
        // For child/grandchild categories, use parent's tree ID
        const parentCategory = await getCategory(finalParentId);
        if (parentCategory) {
            treeId = parentCategory.tree_id;
        } else {
            console.warn(`⚠️ Parent category with ID ${finalParentId} not found. Using default tree ID: ${treeId}`);
        }

        const response = await fetch(getApiUrl('/catalog/trees/categories'), {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify([{
                tree_id: treeId,
                parent_id: finalParentId,
                name: data.name,
                description: data.description,
                page_title: data.page_title,
                meta_keywords: data.meta_keywords || [],
                meta_description: data.meta_description,
                is_visible: data.is_visible ?? true
            }]),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { status: response.status, title: errorText };
            }

            // If it's a duplicate category error, return null
            if (errorData.status === 409 && errorData.title?.includes('duplicate category')) {
                console.warn(`⚠️ Skipping duplicate category: ${data.name}`);
                return null;
            }

            // For other errors, throw
            throw new Error(`Failed to create category: ${errorText}`);
        }

        const result = await response.json() as CreateCategoryResponse;
        
        if (!result.data?.[0]?.category_id) {
            console.error('Invalid response from BigCommerce:', result);
            throw new Error('Invalid response from BigCommerce API');
        }
        
        return result.data[0];
    } catch (error) {
        if (error instanceof Error && error.message.includes('duplicate category')) {
            console.warn(`⚠️ Skipping duplicate category: ${data.name}`);
            return null;
        }
        throw error;
    }
}

export async function createOrGetCategory(data: CreateCategoryData): Promise<number | null> {
    try {
        // First check if category exists
        const categories = await getCategories();
        const existingCategory = categories.find(c => c.name === data.name);

        if (existingCategory) {
            console.log(`✅ Found existing category: ${data.name} (ID: ${existingCategory.category_id})`);
            return existingCategory.category_id;
        }

        // If not found, create new category
        const newCategory = await createCategory({
            ...data,
            is_visible: data.is_visible ?? true
        });

        // If null returned, it means it was a duplicate
        if (!newCategory) {
            console.log(`⚠️ Category ${data.name} already exists but wasn't found in initial check`);
            // Try to find it again
            const updatedCategories = await getCategories();
            const duplicateCategory = updatedCategories.find(c => c.name === data.name);
            if (duplicateCategory) {
                return duplicateCategory.category_id;
            }
            return null;
        }

        console.log(`✅ Created new category: ${newCategory.name} (ID: ${newCategory.category_id})`);
        return newCategory.category_id;
    } catch (error) {
        console.error('Error in createOrGetCategory:', error);
        // Don't throw, just return null to skip this category
        return null;
    }
}
//create metafeilds to a category

export async function createMetafieldForCategory(categoryId: number, metafields: Metafield[]): Promise<void> {
    for (const metafield of metafields) {
        console.log(`📝 Sending metafield to category ${categoryId}`);

        const response = await fetch(getApiUrl(`/catalog/categories/${categoryId}/metafields`), {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(metafield),
        }); 

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Failed to create metafield for category ${categoryId}:`, errorText);
            throw new Error(`Metafield creation failed: ${errorText}`);
        }

        console.log(`✅ Metafield added to category ${categoryId}`);
    }
}

export async function getCategoryMetafields(categoryId: number): Promise<{ resource_id: number; namespace: string; }[]> {
    const response = await fetch(getApiUrl(`/catalog/categories/${categoryId}/metafields`), {
        headers: getHeaders()
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to fetch metafields for category ${categoryId}:`, errorText);
        throw new Error(`Metafields fetch failed: ${errorText}`);
    }

    const result = await response.json();

    // console.log(`📦 Full metafields response for category ${categoryId}:`, JSON.stringify(result, null, 2));
    if (!result.data || result.data.length === 0) {
        console.log(`ℹ️ No metafields found for category ${categoryId}.`);
        return [];
    }
    const mapped = result.data.map((field: any) => {
        // console.log(`🔍 Metafield - resource_id: ${field.resource_id}, namespace: ${field.namespace}`);
        return {
            resource_id: field.resource_id,
            namespace: field.namespace
        };
    });

    return mapped;
}

//GraphQL fetch for detailed metafields of a category
//
const CategoryQuery = graphql(`
    query Category($entityId: Int!, $namespace: String!) {
        site {
            category(entityId: $entityId) {
                name
                entityId
                id
                description
                defaultProductSort
                metafields(namespace: $namespace) {
                    edges {
                        node {
                            entityId
                            id
                            key
                            value
                        }
                        cursor
                    }
                }
            }
        }
    }
`);

type CategoryQueryVariables = VariablesOf<typeof CategoryQuery>;

export const fetchCategoryMetafieldsGraphQL = async (variables: CategoryQueryVariables) => {
    const { data } = await client.fetch({
        document: CategoryQuery,
        variables,
        fetchOptions: {
            next: { revalidate },
        },
    });

    const category = data.site.category;

    const metafields =
        category?.metafields?.edges?.map((edge) => edge.node) ?? [];
    console.log(`Metafields for category ******************** ${JSON.stringify(metafields)}`)

    return {
        category,
        metafields,
    };
};

