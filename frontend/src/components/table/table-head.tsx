import { type FC } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useSort } from '../../contexts/SortContext';
import type { ColumnSchema } from '../../models/ColumnSchema';

interface TableHeadProps {
    columns: ColumnSchema[];
    onSelectAll?: () => void;
    allSelected?: boolean;
}

const TableHead: FC<TableHeadProps> = ({
    columns,
    onSelectAll,
    allSelected = false
}) => {
    const { sortBy, setSortBy } = useSort();

    const handleSort = (column: ColumnSchema) => {
        if (!column.sortable) return;

        setSortBy({
            columnId: column.key,
            direction:
                sortBy?.columnId === column.key && sortBy.direction === 'asc'
                    ? 'desc'
                    : 'asc'
        });
    };

    const getSortIcon = (column: ColumnSchema) => {
        if (!column.sortable) return null;
        if (sortBy?.columnId !== column.key) {
            return <ChevronUp className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />;
        }
        return sortBy.direction === 'asc'
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />;
    };

    return (
        <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
                {onSelectAll && (
                    <th className="w-10 px-3 py-3">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={onSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </th>
                )}
                {columns.map(column => (
                    <th
                        key={column.key}
                        onClick={() => handleSort(column)}
                        className={`
                            px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                            ${column.sortable ? 'cursor-pointer hover:bg-gray-100 group' : ''}
                            ${column.isNumeric ? 'text-right' : 'text-left'}
                        `}
                        style={{ width: column.width }}
                    >
                        <div className="flex items-center gap-1">
                            <span>{column.heading}</span>
                            {getSortIcon(column)}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHead;