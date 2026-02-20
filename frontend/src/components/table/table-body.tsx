import { type FC } from 'react';
import TableRow from './table-row';
import { type ColumnSchema } from '../../models/ColumnSchema';

interface TableBodyProps {
    columns: ColumnSchema[];
    data: any[];
    selectedRows?: any[];
    onRowSelect?: (row: any) => void;
    onRowClick?: (row: any) => void;
}

const TableBody: FC<TableBodyProps> = ({
    columns,
    data,
    selectedRows = [],
    onRowSelect,
    onRowClick
}) => {
    if (data.length === 0) {
        return (
            <tbody>
                <tr>
                    <td
                        colSpan={columns.length + (onRowSelect ? 1 : 0)}
                        className="text-center py-8 text-gray-500"
                    >
                        No data available
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => {
                const isSelected = selectedRows.some(r => r.id === row.id);

                return (
                    <TableRow
                        key={row.id || index}
                        row={row}
                        columns={columns}
                        isSelected={isSelected}
                        onSelect={onRowSelect ? () => onRowSelect(row) : undefined}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                    />
                );
            })}
        </tbody>
    );
};

export default TableBody;