/**
 * Describes how a column participates in filtering.
 * Kept separate from `ColumnSchema` so filter concerns don't pollute the column definition.
 */
export interface FilterDescriptor {
    /**
     * The filter key sent to the API or filter engine.
     * Defaults to `ColumnSchema.key` when omitted.
     */
    filterId?: string;

    /**
     * Named lookup source for dropdown/select filters (e.g. 'bloodTypes', 'genders').
     * When provided, the filter renders as a select populated from this lookup.
     */
    lookupName?: string;

    /**
     * When true, this entry participates in filtering but is NOT rendered as a visible column.
     * Use for filters that don't map to a column (e.g. a date range filter across multiple fields).
     * Pair with `ColumnMeta.visible = false` and never add to the column header row.
     */
    filterOnly?: boolean;
}