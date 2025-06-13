// Helper function to clean environment variables that might have quotes
const cleanEnvVar = (value?: string): string => {
    if (!value) return '';
    // Remove surrounding quotes if present
    return value.replace(/^['"](.+)['"]$/, '$1');
};

export const BIGCOMMERCE_CONFIG = {
    storeHash: cleanEnvVar(process.env.BIGCOMMERCE_STORE_HASH),
    apiToken: cleanEnvVar(process.env.BIGCOMMERCE_ACCESS_TOKEN),
    apiVersion: cleanEnvVar(process.env.BIGCOMMERCE_API_VERSION) || 'v3',
    apiUrl: cleanEnvVar(process.env.BIGCOMMERCE_API_URL) || 'https://api.bigcommerce.com/stores'
};

export const getApiUrl = (endpoint: string): string => {
    // Check if config values are available
    if (!BIGCOMMERCE_CONFIG.storeHash || !BIGCOMMERCE_CONFIG.apiUrl) {
        console.error('BIGCOMMERCE_CONFIG missing required values:', {
            storeHash: !!BIGCOMMERCE_CONFIG.storeHash,
            apiUrl: !!BIGCOMMERCE_CONFIG.apiUrl,
            apiToken: !!BIGCOMMERCE_CONFIG.apiToken
        });
    }
    
    // Use v2 for orders (except metafields), v3 for everything else
    const version = endpoint.startsWith('/orders') && !endpoint.includes('metafields') ? 'v2' : 'v3';
    const baseUrl = `${BIGCOMMERCE_CONFIG.apiUrl}/${BIGCOMMERCE_CONFIG.storeHash}/${version}`;

    return `${baseUrl}${endpoint}`;
};

export const getHeaders = (additionalHeaders: Record<string, string> = {}): Record<string, string> => ({
    'Content-Type': 'application/json',
    'X-Auth-Token': BIGCOMMERCE_CONFIG.apiToken,
    ...additionalHeaders
});
