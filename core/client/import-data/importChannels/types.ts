import { ImportResult } from '../types';

export interface ChannelCSVRow {
    key: string;
    name_en: string;
    hire_purchase_store: string;
    hire_purchase_vendor: string;
    city: string;
    colo: string;
    isActive: string;
    geo_code: string;
    phone: string;
    monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
    publicholidays: string;
}

export interface CreateChannelData {
    name: string;
    type: 'pos' | 'marketplace' | 'storefront' | 'marketing';
    platform: 'custom';
    status: 'active' | 'inactive' | 'connected' | 'disconnected' | 'archived';
    is_listable_from_ui: boolean;
    is_visible: boolean;
    config_meta: {
        app: {
            id: number;
            sections: Array<{
                title: string;
                query_path: string;
            }>;
        };
    };
}

export interface ChannelImportResult extends ImportResult<CreateChannelData[]> {
    successful: Array<{
        key: string;
        name: string;
        id?: string;
        priceListId?: string;
    }>;
    failed: Array<{
        key: string;
        errors: Array<{
            message: string;
            field?: string;
        }>;
    }>;
    data?: CreateChannelData[];
}
