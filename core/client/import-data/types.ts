export interface ImportResult<T> {
    status: 'success' | 'partial' | 'error';
    data?: T;
    errors?: Array<{
        message: string;
        line?: number;
        field?: string;
    }>;
}
  
export interface CSVParserOptions {
    requiredFields?: string[];
    customFields?: string[];
    validateRow?: (row: Record<string, string>) => ImportResult<void>;
}