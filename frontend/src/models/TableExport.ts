export type ExportFormat = 'pdf' | 'excel' | 'csv';

export interface ExportOptions {
    filename?: string;
    title?: string;
    subtitle?: string;
    includeHiddenColumns?: boolean;
    orientation?: 'portrait' | 'landscape';
    pageSize?: 'A4' | 'A3' | 'Letter';
}

export interface ExportData {
    columns: Array<{
        key: string;
        heading: string;
        accessor: string | ((row: any) => any);}>;
    rows: any[];
    title?: string;
    subtitle?: string;
    generatedAt: Date;
    filters?: any[];
}