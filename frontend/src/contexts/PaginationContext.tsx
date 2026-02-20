import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { type Pagination } from '../models/Pagination';

interface PaginationContextValue {
    pagination: Pagination;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    canNextPage: boolean;
    canPrevPage: boolean;
    pageRange: string;
    pageNumbers: number[];
}

const PaginationContext = createContext<PaginationContextValue | undefined>(undefined);

export const usePagination = () => {
    const context = useContext(PaginationContext);
    if (!context) throw new Error('usePagination must be used within PaginationProvider');
    return context;
};

interface PaginationProviderProps {
    children: ReactNode;
    initialPage?: number;
    initialPageSize?: number;
    total: number;
    pageSizeOptions?: number[];
    onPageChange?: (page: number, pageSize: number) => void;
}

export const PaginationProvider: React.FC<PaginationProviderProps> = ({
    children,
    initialPage = 1,
    initialPageSize = 20,
    total,
    pageSizeOptions = [10, 20, 50, 100],
    onPageChange,
}) => {
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const totalPages = Math.ceil(total / pageSize);

    // Calculate page range text (e.g., "1-10 of 100")
    const pageRange = useMemo(() => {
        if (total === 0) return '0 items';
        const start = (page - 1) * pageSize + 1;
        const end = Math.min(page * pageSize, total);
        return `${start}-${end} of ${total}`;
    }, [page, pageSize, total]);

    // Generate page numbers for pagination controls
    const pageNumbers = useMemo(() => {
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const halfVisible = Math.floor(maxVisible / 2);
        let start = Math.max(page - halfVisible, 1);
        let end = Math.min(start + maxVisible - 1, totalPages);

        if (end - start + 1 < maxVisible) {
            start = Math.max(end - maxVisible + 1, 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [page, totalPages]);

    const handleSetPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            onPageChange?.(newPage, pageSize);
        }
    };

    const handleSetPageSize = (newSize: number) => {
        setPageSize(newSize);
        setPage(1);
        onPageChange?.(1, newSize);
    };

    const pagination: Pagination = {
        page,
        pageSize,
        total,
        totalPages,
        pageSizeOptions,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
    };

    return (
        <PaginationContext.Provider value={{
            pagination,
            setPage: handleSetPage,
            setPageSize: handleSetPageSize,
            nextPage: () => handleSetPage(page + 1),
            prevPage: () => handleSetPage(page - 1),
            firstPage: () => handleSetPage(1),
            lastPage: () => handleSetPage(totalPages),
            canNextPage: page < totalPages,
            canPrevPage: page > 1,
            pageRange,
            pageNumbers,
        }}>
            {children}
        </PaginationContext.Provider>
    );
};