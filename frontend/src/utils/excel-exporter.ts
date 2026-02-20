import * as XLSX from 'xlsx';
import type { ExportData, ExportOptions } from '../models/TableExport';

export const exportToExcel = async (
    data: ExportData,
    options: ExportOptions = {}
): Promise<void> => {
    const { filename = 'export', title, subtitle } = options;

    // Prepare worksheet data
    const headers = data.columns.map(col => col.heading);
    const rows = data.rows.map(row =>
        data.columns.map(col => {
            if (typeof col.accessor === 'function') {
                return col.accessor(row);
            }
            return row[col.accessor];
        })
    );

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add title and subtitle if provided
    let worksheetData = [];
    if (title) worksheetData.push([title]);
    if (subtitle) worksheetData.push([subtitle]);
    if (title || subtitle) worksheetData.push([]); // Empty row for spacing

    worksheetData.push(headers);
    worksheetData.push(...rows);

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Style title if present
    if (title) {
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
};