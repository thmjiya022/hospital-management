/**
 * Runtime UI state for a column — lives in component state or a user preferences store.
 * Always keyed to a `ColumnSchema` via `key`.
 *
 * Keep this separate from `ColumnSchema` so the column definition stays pure and serializable.
 */
export interface ColumnMeta {
    /** Must match `ColumnSchema.key`. */
    key: string;

    /**
     * Whether this column is currently rendered in the table.
     * Hidden columns still participate in filtering when `FilterDescriptor.filterOnly` is true.
     */
    visible: boolean;

    /**
     * Whether this column is visible by default when no user preference has been saved.
     * Used to reset column visibility to the system default.
     */
    isDefault: boolean;

    /**
     * The current sort direction applied to this column.
     * Undefined means the column is not the active sort column.
     */
    sortDirection?: 'asc' | 'desc';
}
