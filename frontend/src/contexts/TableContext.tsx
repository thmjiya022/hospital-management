import React, { type FC, type ReactNode } from 'react';
import { SortProvider } from './SortContext';
import { FilterProvider } from './FilterContext';
import { PaginationProvider } from './PaginationContext';
import { SelectionProvider } from './SelectionContext';
import { type ColumnSchema } from '../models/ColumnSchema';
import { type ColumnMeta } from '../models/ColumnMeta';
import { type SortBy } from '../models/SortBy';
import { type Filter } from '../models/Filter';
import { type ExportFormat } from '../models/TableExport';

interface TableContextValue {
    schemas: ColumnSchema[];
    metas: ColumnMeta[];
    updateColumnMeta: (key: string, meta: Partial<ColumnMeta>) => void;
    data: any[];
    loading: boolean;
    onExport?: (format: ExportFormat) => Promise<any>;
}

const TableContext = React.createContext<TableContextValue | undefined>(undefined);

export const useTable = () => {
    const context = React.useContext(TableContext);
    if (!context) throw new Error('useTable must be used within TableProvider');
    return context;
};

interface TableProviderProps {
    children: ReactNode;
    schemas: ColumnSchema[];
    data: any[];
    total: number;
    loading?: boolean;
    onSort?: (sortBy?: SortBy) => void;
    onFilter?: (filters: Filter[]) => void;
    onPageChange?: (page: number, pageSize: number) => void;
    onSelectionChange?: (selected: any[]) => void;
    onExport?: (format: ExportFormat) => Promise<any>;
}

export const TableProvider: FC<TableProviderProps> = ({
    children,
    schemas,
    data,
    total,
    loading = false,
    onSort,
    onFilter,
    onPageChange,
    onSelectionChange,
    onExport,
}) => {
    const [metas, setMetas] = React.useState<ColumnMeta[]>(
        schemas.map(schema => ({
            key: schema.key,
            visible: true,
            isDefault: true,
        }))
    );

    const updateColumnMeta = (key: string, meta: Partial<ColumnMeta>) => {
        setMetas(prev =>
            prev.map(m => m.key === key ? { ...m, ...meta } : m)
        );
    };

    return (
        <TableContext.Provider value={{
            schemas,
            metas,
            updateColumnMeta,
            data,
            loading,
            onExport
        }}>
            <SortProvider onSortChange={onSort}>
                <FilterProvider onFilterChange={onFilter}>
                    <PaginationProvider
                        total={total}
                        onPageChange={onPageChange}
                        initialPageSize={20}
                    >
                        <SelectionProvider
                            items={data}
                            onSelectionChange={onSelectionChange}
                            getItemId={(item) => item.id}
                        >
                            {children}
                        </SelectionProvider>
                    </PaginationProvider>
                </FilterProvider>
            </SortProvider>
        </TableContext.Provider>
    );
};