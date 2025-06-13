import { ChannelCSVRow, CreateChannelData } from './types';

export function mapChannelToCreateData(channel: ChannelCSVRow): CreateChannelData {
    // Convert isActive to status
    const status = (channel.isActive === 'TRUE') ? 'active' : 'inactive';

    // Create opening hours object for custom fields
    const openingHours = {
        monday: channel.monday?.trim(),
        tuesday: channel.Tuesday?.trim(),
        wednesday: channel.Wednesday?.trim(),
        thursday: channel.Thursday?.trim(),
        friday: channel.Friday?.trim(),
        saturday: channel.Saturday?.trim(),
        sunday: channel.Sunday?.trim(),
        publicholidays: channel.publicholidays?.trim()
    };

    // Convert channel name to valid format (only letters, numbers, dash, underscore)
    const name = channel?.name_en
        ?.replace(/&/g, 'and')
        ?.replace(/[^a-zA-Z0-9-_\s]/g, '')
        ?.replace(/\s+/g, '_');

    return {
        name: channel.key,
        type: 'pos', // Setting as POS since these are physical stores
        platform: 'custom',
        status,
        is_listable_from_ui: true,
        is_visible: true,
        config_meta: {
            app: {
                id: Number(process.env.BIGCOMMERCE_APPLICATION_ID),
                sections: [
                    { title: 'Store Details', query_path: 'store-details' },
                    { title: 'store_key', query_path: channel.key },
                    { title: 'hire_purchase_store', query_path: channel.hire_purchase_store || '' },
                    { title: 'hire_purchase_vendor', query_path: channel.hire_purchase_vendor || '' },
                    { title: 'city', query_path: channel.city || '' },
                    { title: 'colo', query_path: channel.colo || '' },
                    { title: 'geo_code', query_path: channel.geo_code || '' },
                    { title: 'phone', query_path: channel.phone || '' },
                    { title: 'opening_hours', query_path: JSON.stringify(openingHours) }
                ]
            },
        },
    };
}

export function mapChannelsToCreateData(channels: ChannelCSVRow[]): CreateChannelData[] {
    return channels.map(mapChannelToCreateData);
}
