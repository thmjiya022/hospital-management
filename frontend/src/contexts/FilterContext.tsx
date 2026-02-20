import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { type Filter } from '../models/Filter';

interface FilterContextValue {
    filters: Filter[];
    addFilter: (filter: Filter) => void;
    removeFilter: (filterId: string) => void;
    updateFilter: (filterId: string, updates: Partial<Filter>) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) throw new Error('useFilter must be used within FilterProvider');
    return context;
};

interface FilterProviderProps {
    children: ReactNode;
    onFilterChange?: (filters: Filter[]) => void;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({
    children,
    onFilterChange
}) => {
    const [filters, setFilters] = useState<Filter[]>([]);

    const handleAddFilter = (filter: Filter) => {
        const newFilters = [...filters, filter];
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const handleRemoveFilter = (filterId: string) => {
        const newFilters = filters.filter(f => f.id !== filterId);
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const handleUpdateFilter = (filterId: string, updates: Partial<Filter>) => {
        const newFilters = filters.map(f =>
            f.id === filterId ? { ...f, ...updates } : f
        );
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const handleClearFilters = () => {
        setFilters([]);
        onFilterChange?.([]);
    };

    return (
        <FilterContext.Provider value={{
            filters,
            addFilter: handleAddFilter,
            removeFilter: handleRemoveFilter,
            updateFilter: handleUpdateFilter,
            clearFilters: handleClearFilters,
            hasActiveFilters: filters.length > 0,
        }}>
            {children}
        </FilterContext.Provider>
    );
};