// models/ColumnSchema.ts (updated with filter and sort integration)
import type { FilterDescriptor } from "./FilterDescriptor";
import type { CellWarning } from "./CellWarning";
// import { FilterOperator } from './Filter';

export interface ColumnSchema<TRow = Record<string, unknown>> {
    /**
     * Unique identifier for this column across the entire table.
     * Used as the React key, the sort key default, and the filter key default.
     */
    key: string;

    /**
     * The column header label shown to the user.
     */
    heading: string;

    /**
     * The field path on the row object to read the cell value from.
     * Supports dot-notation for nested fields (e.g. `'patient.fullName'`).
     */
    accessor: Extract<keyof TRow, string> | (string & {});

    /**
     * When true, the column is right-aligned and uses numeric sorting logic.
     * @default false
     */
    isNumeric?: boolean;

    /**
     * Whether this column can be sorted.
     * @default false
     */
    sortable?: boolean;

    /**
     * The field name sent to the API when sorting by this column.
     * Defaults to `accessor` when omitted.
     */
    sortKey?: string;

    /**
     * Transforms the raw cell value into a display string.
     * Receives both the cell value and the full row for context.
     *
     * @param value  The raw value at `accessor`.
     * @param row    The full row object — useful for composite display logic.
     */
    valueFormatter?: (value: unknown, row: TRow) => string;

    /**
     * Filter configuration for this column.
     * Omit entirely if the column does not support filtering.
     */
    filter?: FilterDescriptor;

    /**
     * Available filter operators for this column.
     * If not provided, defaults based on data type.
     */
    // filterOperators?: FilterOperator[];

    /**
     * Returns a `CellWarning` when the row meets a specific condition, or `undefined` for no warning.
     * Rendered as an icon/tooltip overlay on the cell.
     *
     * @example
     * warning: (row) =>
     *   row.age > 120 ? { message: 'Age seems invalid', severity: 'error' } : undefined,
     */
    warning?: (row: TRow) => CellWarning | undefined;

    /**
     * Optional fixed or minimum column width.
     * Accepts any valid CSS width value (e.g. `'120px'`, `200`, `'10%'`).
     */
    width?: string | number;

    /**
     * Pins the column to the left or right edge of the table — it will not scroll out of view.
     */
    pinned?: 'left' | 'right';
}