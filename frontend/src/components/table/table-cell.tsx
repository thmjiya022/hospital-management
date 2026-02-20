import { type FC } from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { type ColumnSchema } from '../../models/ColumnSchema';
import { type CellWarning } from '../../models/CellWarning';

interface TableCellProps {
    column: ColumnSchema;
    row: any;
}

const TableCell: FC<TableCellProps> = ({ column, row }) => {
    const { accessor, isNumeric, valueFormatter, warning } = column;

    // Get raw value - fix accessor call issue
    const rawValue = (() => {
        if (typeof accessor === 'function') {
            return (accessor as (row: any) => any)(row);
        }
        return row[accessor as string];
    })();

    // Format value
    const displayValue = valueFormatter
        ? valueFormatter(rawValue, row)
        : rawValue?.toString() || '-';

    // Check for warning - with proper type assertion
    const cellWarning: CellWarning | undefined = (() => {
        if (!warning) return undefined;
        // Explicitly type the warning function
        const warningFn = warning as (row: any) => CellWarning | undefined;
        return warningFn(row);
    })();

    const getWarningIcon = (severity: string) => {
        switch (severity) {
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            default:
                return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <td className={`
            px-3 py-2 text-sm
            ${isNumeric ? 'text-right' : 'text-left'}
        `}>
            <div className="flex items-center gap-2">
                <span>{displayValue}</span>
                {cellWarning && (
                    <div
                        className="group relative inline-flex"
                        title={cellWarning.message}>
                        {getWarningIcon(cellWarning.severity)}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {cellWarning.message}
                        </div>
                    </div>
                )}
            </div>
        </td>
    );
};

export default TableCell;