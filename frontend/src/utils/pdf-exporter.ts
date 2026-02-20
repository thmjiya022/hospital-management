import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ExportData, ExportOptions } from '../models/TableExport';

export const exportToPDF = async (
    data: ExportData,
    options: ExportOptions = {}
): Promise<void> => {
    const {
        filename = 'export',
        title,
        subtitle,
        orientation = 'landscape',
        pageSize = 'A4'
    } = options;

    const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
    });

    let yOffset = 10;

    // Add title
    if (title) {
        doc.setFontSize(16);
        doc.text(title, 14, yOffset);
        yOffset += 8;
    }

    // Add subtitle
    if (subtitle) {
        doc.setFontSize(11);
        doc.text(subtitle, 14, yOffset);
        yOffset += 8;
    }

    // Add generation timestamp
    doc.setFontSize(8);
    doc.text(`Generated: ${data.generatedAt.toLocaleString()}`, 14, yOffset);
    yOffset += 8;

    // Prepare table data
    const headers = data.columns.map(col => col.heading);
    const rows = data.rows.map(row =>
        data.columns.map(col => {
            if (typeof col.accessor === 'function') {
                return col.accessor(row);
            }
            return row[col.accessor]?.toString() || '';
        })
    );

    // Generate table
    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: yOffset,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [66, 66, 66], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
    });

    doc.save(`${filename}.pdf`);
};