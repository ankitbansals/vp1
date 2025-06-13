import { CSVParser } from '../csvParser';
import { mapPriceListAssignments } from './priceListMapper';
import { PriceListCSVRow, PriceListImportResult } from './types';
import { createMultiplePriceListAssignments, getPriceListByName } from '~/client/rest-api/create-price-list';

export class PriceListAssignmentsImportService {
    private parser: CSVParser;

    constructor() {
        this.parser = new CSVParser({
            delimiter: ',', // Using tab delimiter since your CSV uses tabs
            requiredFields: ['product_key', 'amount', 'store_key'],
            type: 'price'
        });
        console.log('Parser configuration:', this.parser);
    }

    async importPriceListAssignments(priceListsCSV: string): Promise<PriceListImportResult> {
        console.log('🚀 Starting price list assignment import process...');
        try {
            console.log('📄 Parsing CSV data...');
            // Show first few lines of CSV to debug column structure
            const csvLines = priceListsCSV.split('\n');
            if (csvLines.length < 2) {
                return {
                    status: 'error',
                    successful: [],
                    failed: [],
                    errors: [{ message: 'CSV file is empty or missing header row' }]
                };
            }
            const parseResult = this.parser.parse(priceListsCSV);

            if (parseResult.status === 'error' || !parseResult.data) {
                return {
                    status: 'error',
                    successful: [],
                    failed: [],
                    errors: parseResult.errors || [{ message: 'Failed to parse CSV data' }]
                };
            }

            const rows = parseResult.data as PriceListCSVRow[];

            const successful: Array<{ sku: string; id: number }> = [];
            const failed: Array<{ sku: string; errors: Array<{ message: string }> }> = [];

            try {
                if (rows.length === 0) {
                    return {
                        status: 'error',
                        successful: [],
                        failed: [],
                        errors: [{ message: 'No valid data found in CSV' }]
                    };
                }

                // Group rows by store key
                console.log('Grouping rows by store key...');
                const storeGroups = rows.reduce((groups, row) => {
                    const group = groups.get(row.store_key) || [];
                    group.push(row);
                    groups.set(row.store_key, group);
                    return groups;
                }, new Map<string, PriceListCSVRow[]>());

                // Process each store's price assignments
                for (const [storeKey, storeRows] of storeGroups) {
                    // Get price list ID for this store
                    console.log(`Getting price list ID for store: ${storeKey}`);
                    const priceListId = await getPriceListByName(`${storeKey}-pricelist`);
                    
                    if (!priceListId) {
                        console.error(`No price list found for store: ${storeKey}`);
                        storeRows.forEach(row => {
                            failed.push({
                                sku: row.product_key,
                                errors: [{ message: `No price list found for store: ${storeKey}` }]
                            });
                        });
                        continue;
                    }

                    // Create price list assignments for this store
                    console.log(`📝 Processing price assignments for store ${storeKey}:`, {
                        priceListId,
                        rowCount: storeRows.length,
                        sampleRow: storeRows[0]
                    });

                    // Map rows to assignments
                    console.log('Mapping rows to price list assignments...');
                    const assignments = mapPriceListAssignments(storeRows);
                    console.log('Mapped assignments:', {
                        count: assignments.length,
                        sample: assignments[0]
                    });
                    
                    // Create assignments
                    console.log(`Creating ${assignments.length} price assignments...`);
                    const result = await createMultiplePriceListAssignments(priceListId, assignments);
                    
                    // Process results
                    if (result.successful.length > 0) {
                        console.log('✅ Successfully created assignments:', {
                            store: storeKey,
                            count: result.successful.length,
                            sample: result.successful[0]
                        });
                    }

                    if (result.failed.length > 0) {
                        console.warn('❌ Failed assignments:', {
                            store: storeKey,
                            count: result.failed.length,
                            sampleErrors: result.failed.slice(0, 3).map(f => ({
                                sku: f.sku,
                                errors: f.errors
                            }))
                        });
                    }
                    
                    successful.push(...result.successful);
                    failed.push(...result.failed);
                    
                    // Summary
                    console.log(`📊 Summary for store ${storeKey}:`, {
                        total: assignments.length,
                        successful: result.successful.length,
                        failed: result.failed.length
                    });
                }
            } catch (error) {
                console.error('Error creating price list assignments:', error);
                rows.forEach(row => {
                    failed.push({
                        sku: row.product_key,
                        errors: [{ message: error instanceof Error ? error.message : 'Unknown error occurred' }]
                    });
                });
            }

            return {
                status: failed.length === 0 ? 'success' : successful.length > 0 ? 'partial' : 'error',
                successful,
                failed
            };
        } catch (error) {
            console.error('Error importing price lists:', error);
            return {
                status: 'error',
                successful: [],
                failed: [],
                errors: [{ message: error instanceof Error ? error.message : 'Unknown error occurred' }]
            };
        }
    }
}
