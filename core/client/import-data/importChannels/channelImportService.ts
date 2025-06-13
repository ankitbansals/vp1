import { ChannelCSVRow, ChannelImportResult, CreateChannelData } from './types';
import { CSVParser } from '../csvParser';
import { createChannel } from '~/client/rest-api/create-channel';
import { createPriceList } from '~/client/rest-api/create-price-list';
import { mapChannelsToCreateData } from './channelMapper';

export class ChannelImportService {
    private parser: CSVParser;

    constructor() {
        this.parser = new CSVParser({
            delimiter: ',',
            requiredFields: ['key', 'name_en', 'isActive']
        });
    }

    async importChannels(channelsCSV: string): Promise<ChannelImportResult> {
        console.log('🚀 Starting channel import process...');
        try {
            console.log('📄 Parsing channels CSV...');
            const parseResult = this.parser.parse(channelsCSV);
            console.log(`✓ Parsed ${parseResult.data?.length || 0} channels from CSV`);

            if (parseResult.status === 'error' || !parseResult.data) {
                return {
                    status: 'error',
                    successful: [],
                    failed: [],
                    errors: parseResult.errors || [{ message: 'Failed to parse channels CSV' }]
                };
            }

            const channels = parseResult.data as ChannelCSVRow[];
            console.log('🔄 Mapping channels to BigCommerce format...');
            
            const mappedChannels = this.mapChannels(channels);
            console.log(`✓ Mapped ${mappedChannels.length} channels`);

            const validationResult = this.validateChannels(mappedChannels);
            console.log(`✓ Validation complete: ${validationResult.successful.length} passed, ${validationResult.failed.length} failed`);

            if (validationResult.status === 'error') {
                return validationResult;
            }

            console.log('🌐 Creating channels in BigCommerce...');
            const createResult = await this.createChannels(validationResult.data || []);
            console.log(`✓ Creation complete: ${createResult.successful.length} created, ${createResult.failed.length} failed`);

            return createResult;
        } catch (error) {
            console.error('Error importing channels:', error);
            return {
                status: 'error',
                successful: [],
                failed: [],
                errors: [{ message: error instanceof Error ? error.message : 'Unknown error occurred' }]
            };
        }
    }

    private mapChannels(channels: ChannelCSVRow[]): CreateChannelData[] {
        return mapChannelsToCreateData(channels);
    }

    private validateChannels(channels: CreateChannelData[]): ChannelImportResult {
        const validatedChannels: CreateChannelData[] = [];
        const failed: Array<{ key: string; errors: Array<{ message: string; field?: string }> }> = [];

        for (const channel of channels) {
            const errors = this.validateChannel(channel);
            const storeKey = channel.config_meta.app.sections.find(f => f.title === 'store_key')?.query_path || '';

            if (errors.length === 0) {
                validatedChannels.push(channel);
            } else {
                failed.push({
                    key: storeKey,
                    errors
                });
            }
        }

        const successful = validatedChannels.map(channel => ({
            key: channel.config_meta.app.sections.find(f => f.title === 'store_key')?.query_path || '',
            name: channel.name,
            id: undefined,
            priceListId: undefined
        }));

        return {
            status: failed.length > 0 ? (successful.length > 0 ? 'partial' : 'error') : 'success',
            data: validatedChannels,
            successful,
            failed
        };
    }

    private validateChannel(channel: CreateChannelData): Array<{ message: string; field?: string }> {
        const errors: Array<{ message: string; field?: string }> = [];

        if (!channel.name) {
            errors.push({ message: 'Name is required', field: 'name' });
        }

        if (!channel.type) {
            errors.push({ message: 'Type is required', field: 'type' });
        }

        if (!channel.status) {
            errors.push({ message: 'Status is required', field: 'status' });
        }

        const storeKey = channel.config_meta.app.sections.find(f => f.title === 'store_key')?.query_path;
        if (!storeKey) {
            errors.push({ message: 'Store key is required', field: 'store_key' });
        }

        return errors;
    }

    private async createChannels(channels: CreateChannelData[]): Promise<ChannelImportResult> {
        const successful: Array<{ key: string; name: string; id?: string; priceListId?: string }> = [];
        const failed: Array<{ key: string; errors: Array<{ message: string; field?: string }> }> = [];

        for (const channel of channels) {
            try {
                const { response, data } = await createChannel(channel);
                const storeKey = channel.config_meta.app.sections.find(f => f.title === 'store_key')?.query_path || '';

                if (!response.ok) {
                    // If it's a duplicate channel error (409), treat it as successful but check price list
                    if (response.status === 409) {
                        console.log(`Channel already exists: ${channel.name}`);
                        
                        // Try to create a price list for existing channel
                        const priceListData = {
                            name: `${channel.name}-pricelist`,
                            active: true
                        };
                        
                        try {
                            const priceListResult = await createPriceList(priceListData);
                            if (priceListResult.response.ok) {
                                console.log(`Created price list for existing channel ${channel.name}`);
                                successful.push({
                                    key: storeKey,
                                    name: channel.name,
                                    id: undefined, // We don't have the ID for existing channels
                                    priceListId: priceListResult.data.data.id
                                });
                            } else if (priceListResult.response.status === 409) {
                                console.log(`Price list already exists for channel ${channel.name}`);
                                successful.push({
                                    key: storeKey,
                                    name: channel.name,
                                    id: undefined // We don't have the ID for existing channels
                                });
                            } else {
                                console.warn(`Failed to create price list for existing channel ${channel.name}:`, priceListResult.data);
                                successful.push({
                                    key: storeKey,
                                    name: channel.name,
                                    id: undefined
                                });
                            }
                        } catch (priceListError) {
                            console.warn(`Error creating price list for existing channel ${channel.name}:`, priceListError);
                            successful.push({
                                key: storeKey,
                                name: channel.name,
                                id: undefined
                            });
                        }
                        continue;
                    }
                    
                    throw new Error(data.title || data.message || 'Failed to create channel');
                }

                // Create a price list for the channel
                const priceListData = {
                    name: `${channel.name}-pricelist`,
                    active: true
                };
                
                const priceListResult = await createPriceList(priceListData);
                if (!priceListResult.response.ok) {
                    console.warn(`Failed to create price list for channel ${channel.name}:`, priceListResult.data);
                }

                successful.push({
                    key: storeKey,
                    name: channel.name,
                    id: data.data?.id,
                    priceListId: priceListResult.response.ok ? priceListResult.data.data.id : undefined
                });
            } catch (error) {
                const storeKey = channel.config_meta.app.sections.find(f => f.title === 'store_key')?.query_path || '';
                failed.push({
                    key: storeKey,
                    errors: [{
                        message: error instanceof Error ? error.message : 'Failed to create channel',
                        field: undefined
                    }]
                });
            }
        }

        return {
            status: failed.length > 0 ? (successful.length > 0 ? 'partial' : 'error') : 'success',
            successful,
            failed,
            data: channels
        };
    }
}
