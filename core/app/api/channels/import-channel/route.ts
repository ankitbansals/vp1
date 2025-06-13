import { NextRequest } from 'next/server';
import { ChannelImportService } from '~/client/import-data/importChannels/channelImportService';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const channelsFile = formData.get('channels') as File;

        if (!channelsFile) {
            return Response.json(
                { error: 'Channels file is required' },
                { status: 400 }
            );  
        }

        console.log('Reading channels file...');
        const channelsCsv = await channelsFile.text();

        // Import channels
        const channelImporter = new ChannelImportService();
        const result = await channelImporter.importChannels(channelsCsv);

        return Response.json({
            status: result.status,
            message: `Successfully processed ${result.successful.length} channels`,
            successful: result.successful,
            failed: result.failed,
            errors: result.errors
        });
    } catch (error) {
        console.error('Error importing channels:', error);
        return Response.json(
            { error: 'Failed to import channels' },
            { status: 500 }
        );
    }
}
