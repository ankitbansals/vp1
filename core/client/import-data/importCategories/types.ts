import { ImportResult } from '../types';

export interface CategoryCSVRow {
    key: string;
    name_en: string;
    parent_category_key?: string;
    slug_en: string;
    description_en?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords_en?: string;
    isActive: boolean;
    isBrandCategory: boolean;
}

export interface CreateCategoryData {
    name: string;
    description?: string;
    parent_id?: number;
    page_title?: string;
    meta_keywords?: string[];
    meta_description?: string;
    is_visible?: boolean;
    custom_url?: {
        url: string;
        is_customized: boolean;
    };
}

export interface CategoryImportResult extends ImportResult<CreateCategoryData[]> {
    successful: Array<{
        key: string;
        name: string;
        id?: string;
    }>;
    failed: Array<{
        key: string;
        errors: Array<{
            message: string;
            field?: string;
        }>;
    }>;
    data?: CreateCategoryData[];
}
