import { type FC } from 'react';
import TableCell from './table-cell';
import type { ColumnSchema } from '../../models/ColumnSchema';

interface TableRowProps {
    row: any;
    columns: ColumnSchema[];
    isSelected?: boolean;
    onSelect?: () => void;
    onClick?: () => void;
}

const TableRow: FC<TableRowProps> = ({
    row,
    columns,
    isSelected = false,
    onSelect,
    onClick
}) => {
    return (
        <tr
            className={`
                hover:bg-gray-50 transition-colors
                ${onClick ? 'cursor-pointer' : ''}
                ${isSelected ? 'bg-blue-50' : ''}
            `}
            onClick={onClick}>
            {onSelect && (
                <td className="w-10 px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onSelect}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                </td>
            )}
            {columns.map(column => (
                <TableCell
                    key={column.key}
                    column={column}
                    row={row}
                />
            ))}
        </tr>
    );
};

export default TableRow;