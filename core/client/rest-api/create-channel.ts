import { CreateChannelData } from '../import-data/importChannels/types';
import { getApiUrl, getHeaders } from './config';

interface CreateChannelResponse {
    response: Response;
    data: any;
}

export async function createChannel(channelData: CreateChannelData): Promise<CreateChannelResponse> {
    try {
        const response = await fetch(getApiUrl('/channels'), {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(channelData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('BigCommerce API Error:', data);
        }

        return { response, data };
    } catch (error) {
        console.error('Error creating channel:', error);
        throw error;
    }
}

export async function createMultipleChannels(channels: CreateChannelData[]): Promise<{
    status: 'success' | 'partial' | 'error';
    successfulChannels: Array<{ key: string; name: string; id?: string }>;
    failedChannels: Array<{
        channel: string;
        errors: Array<{ message: string; field?: string }>;
    }>;
}> {
    const successfulChannels: Array<{ key: string; name: string; id?: string }> = [];
    const failedChannels: Array<{
        channel: string;
        errors: Array<{ message: string; field?: string }>;
    }> = [];

    for (const channel of channels) {
        try {
            const result = await createChannel(channel);
            const channelData = result.data;
            const storeKey = channel.config_meta.app.sections.find(f => f.title === 'store_key')?.query_path || '';
            successfulChannels.push({
                key: storeKey,
                name: channel.name,
                id: channelData?.id
            });
        } catch (error) {
            const storeKey = channel.config_meta.app.sections.find(f => f.title === 'store_key')?.query_path || '';
            failedChannels.push({
                channel: storeKey,
                errors: [{
                    message: error instanceof Error ? error.message : 'Failed to create channel',
                    field: undefined
                }]
            });
        }
    }

    return {
        status: failedChannels.length > 0 ? (successfulChannels.length > 0 ? 'partial' : 'error') : 'success',
        successfulChannels,
        failedChannels
    };
}
