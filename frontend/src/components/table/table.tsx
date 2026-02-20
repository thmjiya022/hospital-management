import { type FC, useState } from 'react';
import { useTable } from '../../contexts/TableContext';
import { usePagination } from '../../contexts/PaginationContext';
import { useSelection } from '../../contexts/SelectionContext';
import TableHead from './table-head';
import TableBody from './table-body';
import TableMenu from './table-menu';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TableProps {
    className?: string;
    onRowClick?: (row: any) => void;
    enableColumnMenu?: boolean;
    enablePagination?: boolean;
    enableSelection?: boolean;
    emptyStateMessage?: string;
}

const Table: FC<TableProps> = ({
    className = '',
    onRowClick,
    enableColumnMenu = true,
    enablePagination = true,
    enableSelection = true,
    emptyStateMessage = 'No data available',
}) => {
    const { schemas, metas, data, loading } = useTable();
    const {
        pagination,
        setPage,
        setPageSize,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        canNextPage,
        canPrevPage,
        pageRange,
        pageNumbers
    } = usePagination();
    const {
        selectedItems,
        toggleItem,
        selectAll,
        clearSelection,
        hasSelection,
        selectionCount
    } = useSelection();

    const [showMenu, setShowMenu] = useState(false);

    // Get visible columns based on meta
    const visibleColumns = schemas.filter(schema => {
        const meta = metas.find(m => m.key === schema.key);
        return meta?.visible !== false;
    });

    // Handle select all
    const handleSelectAll = () => {
        if (selectedItems.length === data.length) {
            clearSelection();
        } else {
            selectAll(data);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                <p className="text-sm text-gray-500">Loading data...</p>
            </div>
        );
    }

    // Empty state
    if (!loading && data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-sm text-gray-500">{emptyStateMessage}</p>
            </div>
        );
    }

    return (
        <div className={`flex flex-col space-y-4 ${className}`}>
            {/* Table toolbar */}
            <div className="flex justify-between items-center">
                {/* Selection info */}
                {enableSelection && hasSelection && (
                    <div className="text-sm text-gray-600">
                        {selectionCount} item{selectionCount !== 1 ? 's' : ''} selected
                    </div>
                )}

                {/* Column menu */}
                {enableColumnMenu && (
                    <div className="relative ml-auto">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            title="Customize columns"
                        >
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                            </svg>
                        </button>
                        {showMenu && <TableMenu onClose={() => setShowMenu(false)} />}
                    </div>
                )}
            </div>

            {/* Table container */}
            <div className="relative overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left border-collapse table-auto">
                    <TableHead
                        columns={visibleColumns}
                        onSelectAll={enableSelection ? handleSelectAll : undefined}
                        allSelected={enableSelection && data.length > 0 && selectedItems.length === data.length}
                    />
                    <TableBody
                        columns={visibleColumns}
                        data={data}
                        selectedRows={selectedItems}
                        onRowSelect={enableSelection ? toggleItem : undefined}
                        onRowClick={onRowClick}
                    />
                </table>
            </div>

            {/* Pagination */}
            {enablePagination && pagination.totalPages > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                    {/* Page size selector */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Rows per page:</span>
                        <select
                            value={pagination.pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="border border-gray-300 rounded-md text-sm p-1"
                        >
                            {pagination.pageSizeOptions?.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    {/* Page info */}
                    <div className="text-sm text-gray-700">
                        {pageRange}
                    </div>

                    {/* Pagination controls */}
                    <nav className="flex items-center space-x-2" aria-label="Pagination">
                        <button
                            onClick={firstPage}
                            disabled={!canPrevPage}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="First page"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={prevPage}
                            disabled={!canPrevPage}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Page numbers */}
                        <div className="flex items-center space-x-1">
                            {pageNumbers.map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`
                                        px-3 py-1 text-sm rounded-md
                                        ${pagination.page === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-100 text-gray-700'
                                        }
                                    `}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={!canNextPage}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Next page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={lastPage}
                            disabled={!canNextPage}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Last page"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Table;