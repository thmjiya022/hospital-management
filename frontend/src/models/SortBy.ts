/**
 * Represents the current sort state for a table
 */
export interface SortBy {
    /** The column key being sorted (matches ColumnSchema.key) */
    columnId: string;

    /** Sort direction */
    direction: 'asc' | 'desc';

    /** Optional custom sort key for API (falls back to columnId) */
    sortKey?: string;
}

/**
 * Sort direction constants for type safety
 */
export const SortDirection = {
    ASC: 'asc' as const,
    DESC: 'desc' as const,
} as const;

export type SortDirectionType = typeof SortDirection[keyof typeof SortDirection];

/**
 * Helper type for API requests
 */
export interface SortRequest {
    sortBy?: string;      // The field name to sort by
    sortOrder?: 'asc' | 'desc';  // Sort direction
}

/**
 * Convert SortBy to API request format
 */
export const toSortRequest = (sortBy?: SortBy): SortRequest | undefined => {
    if (!sortBy) return undefined;

    return {
        sortBy: sortBy.sortKey || sortBy.columnId,
        sortOrder: sortBy.direction,
    };
};