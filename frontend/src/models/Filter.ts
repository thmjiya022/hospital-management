/**
 * Filter operator types supported by the table
 */
export type FilterOperator =
    | 'eq'          // Equals
    | 'neq'         // Not equals
    | 'gt'          // Greater than
    | 'gte'         // Greater than or equal
    | 'lt'          // Less than
    | 'lte'         // Less than or equal
    | 'contains'    // Contains (text)
    | 'startsWith'  // Starts with (text)
    | 'endsWith'    // Ends with (text)
    | 'in'          // In array
    | 'between'     // Between two values
    | 'isNull'      // Is null
    | 'isNotNull';  // Is not null

/**
 * Filter value types supported
 */
export type FilterValue =
    | string
    | number
    | boolean
    | Date
    | Array<string | number>
    | [Date, Date]  // Date range
    | [number, number]; // Number range

/**
 * Active filter applied to a table
 */
export interface Filter {
    /** Unique identifier for this filter instance */
    id: string;

    /** The column key this filter applies to (matches ColumnSchema.key) */
    columnId: string;

    /** Filter operator */
    operator: FilterOperator;

    /** Filter value(s) */
    value: FilterValue;

    /** Optional label for display */
    label?: string;

    /** Whether this filter is temporary (not persisted) */
    isTemporary?: boolean;

    /** Whether this filter is disabled */
    disabled?: boolean;
}

/**
 * Filter option for dropdown/select filters
 */
export interface FilterOption {
    /** Option value */
    value: string | number;

    /** Display label */
    label: string;

    /** Optional icon */
    icon?: React.ReactNode;

    /** Optional group */
    group?: string;
}

/**
 * Date range filter value
 */
export interface DateRangeFilter {
    start: Date;
    end: Date;
    preset?: 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'lastWeek' | 'lastMonth' | 'custom';
}

/**
 * Number range filter value
 */
export interface NumberRangeFilter {
    min?: number;
    max?: number;
}

/**
 * Filter builder for creating filters programmatically
 */
export class FilterBuilder {
    private filter: Partial<Filter> = {};

    static create(): FilterBuilder {
        return new FilterBuilder();
    }

    forColumn(columnId: string): this {
        this.filter.columnId = columnId;
        return this;
    }

    withOperator(operator: FilterOperator): this {
        this.filter.operator = operator;
        return this;
    }

    withValue(value: FilterValue): this {
        this.filter.value = value;
        return this;
    }

    withLabel(label: string): this {
        this.filter.label = label;
        return this;
    }

    build(): Filter {
        if (!this.filter.columnId || !this.filter.operator || this.filter.value === undefined) {
            throw new Error('Filter requires columnId, operator, and value');
        }

        return {
            id: `${this.filter.columnId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            columnId: this.filter.columnId,
            operator: this.filter.operator,
            value: this.filter.value,
            label: this.filter.label,
            isTemporary: false,
            disabled: false,
        };
    }
}

/**
 * Convert filter to API request format
 */
export interface FilterRequest {
    [key: string]: {
        operator: FilterOperator;
        value: FilterValue;
    };
}

/**
 * Convert array of filters to API request format
 */
export const toFilterRequest = (filters: Filter[]): FilterRequest => {
    return filters.reduce((acc, filter) => {
        acc[filter.columnId] = {
            operator: filter.operator,
            value: filter.value,
        };
        return acc;
    }, {} as FilterRequest);
};

/**
 * Create an equals filter
 */
export const eq = (columnId: string, value: string | number | boolean): Filter => ({
    id: `${columnId}-eq-${Date.now()}`,
    columnId,
    operator: 'eq',
    value,
});

/**
 * Create a contains filter (for text search)
 */
export const contains = (columnId: string, value: string): Filter => ({
    id: `${columnId}-contains-${Date.now()}`,
    columnId,
    operator: 'contains',
    value,
});

/**
 * Create a between filter (for ranges)
 */
// export const between = (columnId: string, min: number | Date, max: number | Date): Filter => ({
//     id: `${columnId}-between-${Date.now()}`,
//     columnId,
//     operator: 'between',
//     value: [min, max] as [typeof min, typeof max],
// });

/**
 * Create an IN filter (for multiple values)
 */
export const inArray = (columnId: string, values: Array<string | number>): Filter => ({
    id: `${columnId}-in-${Date.now()}`,
    columnId,
    operator: 'in',
    value: values,
});

/**
 * Filter operator display names
 */
export const FilterOperatorLabels: Record<FilterOperator, string> = {
    eq: 'Equals',
    neq: 'Not Equals',
    gt: 'Greater Than',
    gte: 'Greater Than or Equal',
    lt: 'Less Than',
    lte: 'Less Than or Equal',
    contains: 'Contains',
    startsWith: 'Starts With',
    endsWith: 'Ends With',
    in: 'Any Of',
    between: 'Between',
    isNull: 'Is Empty',
    isNotNull: 'Is Not Empty',
};

/**
 * Get appropriate operators for data type
 */
export const getOperatorsForType = (type: 'string' | 'number' | 'date' | 'boolean'): FilterOperator[] => {
    const base: FilterOperator[] = ['eq', 'neq', 'isNull', 'isNotNull'];

    switch (type) {
        case 'string':
            return [...base, 'contains', 'startsWith', 'endsWith', 'in'];
        case 'number':
            return [...base, 'gt', 'gte', 'lt', 'lte', 'between', 'in'];
        case 'date':
            return [...base, 'gt', 'gte', 'lt', 'lte', 'between'];
        case 'boolean':
            return ['eq', 'neq'];
        default:
            return base;
    }
};