/**
 * Pagination state for tables
 */
export interface Pagination {
    /** Current page number (1-based) */
    page: number;

    /** Number of items per page */
    pageSize: number;

    /** Total number of items across all pages */
    total: number;

    /** Total number of pages */
    totalPages: number;

    /** Available page size options */
    pageSizeOptions?: number[];

    /** Whether there is a next page */
    hasNext?: boolean;

    /** Whether there is a previous page */
    hasPrevious?: boolean;
}

/**
 * Pagination request parameters for API calls
 */
export interface PaginationRequest {
    /** Page number to fetch (1-based) */
    page?: number;

    /** Number of items per page */
    pageSize?: number;

    /** Offset for cursor-based pagination */
    offset?: number;

    /** Limit for cursor-based pagination */
    limit?: number;
}

/**
 * Paginated response from API
 */
export interface PaginatedResponse<T> {
    /** Array of items for current page */
    data: T[];

    /** Total number of items across all pages */
    total: number;

    /** Current page number */
    page: number;

    /** Number of items per page */
    pageSize: number;

    /** Total number of pages */
    totalPages: number;

    /** Optional cursor for next page */
    nextCursor?: string;

    /** Optional cursor for previous page */
    previousCursor?: string;
}

/**
 * Default pagination constants
 */
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const MAX_PAGE_SIZE = 1000;

/**
 * Create default pagination state
 */
export const createDefaultPagination = (): Pagination => ({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
    pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    hasNext: false,
    hasPrevious: false,
});

/**
 * Create pagination from API response
 */
export const fromPaginatedResponse = <T>(
    response: PaginatedResponse<T>
): Pagination => ({
    page: response.page,
    pageSize: response.pageSize,
    total: response.total,
    totalPages: response.totalPages,
    pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    hasNext: response.page < response.totalPages,
    hasPrevious: response.page > 1,
});

/**
 * Calculate total pages
 */
export const calculateTotalPages = (total: number, pageSize: number): number => {
    return Math.ceil(total / pageSize);
};

/**
 * Validate page number is within bounds
 */
export const validatePage = (page: number, totalPages: number): number => {
    if (page < 1) return 1;
    if (page > totalPages) return totalPages || 1;
    return page;
};

/**
 * Get page range for display (e.g., "1-10 of 100")
 */
export const getPageRangeText = (pagination: Pagination): string => {
    const start = ((pagination.page - 1) * pagination.pageSize) + 1;
    const end = Math.min(pagination.page * pagination.pageSize, pagination.total);

    if (pagination.total === 0) return '0 items';
    return `${start}-${end} of ${pagination.total}`;
};

/**
 * Generate array of page numbers for pagination controls
 */
export const getPageNumbers = (
    currentPage: number,
    totalPages: number,
    maxVisible: number = 5
): number[] => {
    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisible / 2);
    let start = Math.max(currentPage - halfVisible, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start + 1 < maxVisible) {
        start = Math.max(end - maxVisible + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * Pagination cursor for infinite scroll
 */
export interface PaginationCursor {
    /** Cursor for next page */
    next?: string;

    /** Cursor for previous page */
    previous?: string;

    /** Whether there are more items */
    hasMore: boolean;
}

// /**
//  * Offset-based pagination calculator
//  */
// export class OffsetPagination {
//     constructor(
//         public page: number = 1,
//         public pageSize: number = DEFAULT_PAGE_SIZE
//     ) { }

//     get offset(): number {
//         return (this.page - 1) * this.pageSize;
//     }

//     get limit(): number {
//         return this.pageSize;
//     }

//     nextPage(): OffsetPagination {
//         return new OffsetPagination(this.page + 1, this.pageSize);
//     }

//     previousPage(): OffsetPagination {
//         return new OffsetPagination(Math.max(this.page - 1, 1), this.pageSize);
//     }

//     setPageSize(newSize: number): OffsetPagination {
//         return new OffsetPagination(1, newSize);
//     }
// }

// /**
//  * Cursor-based pagination calculator
//  */
// export class CursorPagination {
//     constructor(
//         public cursor?: string,
//         public limit: number = DEFAULT_PAGE_SIZE,
//         public direction: 'next' | 'prev' = 'next'
//     ) { }

//     nextPage(cursor: string): CursorPagination {
//         return new CursorPagination(cursor, this.limit, 'next');
//     }

//     previousPage(cursor: string): CursorPagination {
//         return new CursorPagination(cursor, this.limit, 'prev');
//     }

//     setLimit(limit: number): CursorPagination {
//         return new CursorPagination(this.cursor, limit, this.direction);
//     }
// }

/**
 * Pagination state for React hooks
 */
export interface PaginationState {
    pagination: Pagination;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    canNextPage: boolean;
    canPreviousPage: boolean;
    pageRange: string;
    pageNumbers: number[];
}

/**
 * Hook for managing pagination state (to be used in React components)
 */
// export const usePagination = (
//     initialPagination: Partial<Pagination> = {}
// ): PaginationState => {
//     // This is just the interface - actual implementation would be in a React hook
//     throw new Error('This is a type definition. Use the actual hook implementation.');
// };

/**
 * Example API request builder with pagination
 */
export interface ApiRequestWithPagination {
    pagination: PaginationRequest;
    sort?: any;
    filters?: any;
}

/**
 * Build API request with pagination
 */
export const buildApiRequest = (
    pagination: Pagination,
    additionalParams: Record<string, any> = {}
): ApiRequestWithPagination => ({
    pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
    },
    ...additionalParams,
});