/**
 * Describes a warning to be displayed inside a table cell.
 * Return from `ColumnSchema.warning()` to flag a row conditionally.
 */
export interface CellWarning {
    /** Short message shown in the warning tooltip or inline. */
    message: string;
    /** Visual severity level — drives icon and color. */
    severity: 'info' | 'warning' | 'error';
}
