import { type FC, useState } from 'react';
import { Download } from 'lucide-react';
import { useTable } from '../../contexts/TableContext';
import type { ExportFormat, ExportOptions } from '../../models/TableExport';

interface TableExportProps {
    onExport?: (format: ExportFormat, options?: ExportOptions) => Promise<void>;
    disabled?: boolean;
    className?: string;
}

const TableExport: FC<TableExportProps> = ({
    onExport: propOnExport,
    disabled,
    className = ''
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const { onExport: contextOnExport } = useTable();

    const handleExport = async (format: ExportFormat) => {
        setIsExporting(true);
        try {
            // Use prop onExport if provided, otherwise use context onExport
            const exportFn = propOnExport || contextOnExport;
            if (exportFn) {
                await exportFn(format, {
                    filename: `export-${new Date().toISOString().split('T')[0]}`,
                });
            }
        } finally {
            setIsExporting(false);
            setShowMenu(false);
        }
    };

    const formats: { value: ExportFormat; label: string }[] = [
        { value: 'excel', label: 'Excel' },
        { value: 'csv', label: 'CSV' },
        { value: 'pdf', label: 'PDF' },
    ];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                disabled={disabled || isExporting || (!propOnExport && !contextOnExport)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 ${className}`}
            >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    {formats.map((format) => (
                        <button
                            key={format.value}
                            onClick={() => handleExport(format.value)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                        >
                            {format.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TableExport;