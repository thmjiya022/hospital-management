import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { type SortBy } from '../models/SortBy';

interface SortContextValue {
    sortBy?: SortBy;
    setSortBy: (sortBy?: SortBy) => void;
    clearSort: () => void;
}

const SortContext = createContext<SortContextValue | undefined>(undefined);

export const useSort = () => {
    const context = useContext(SortContext);
    if (!context) throw new Error('useSort must be used within SortProvider');
    return context;
};

interface SortProviderProps {
    children: ReactNode;
    onSortChange?: (sortBy?: SortBy) => void;
}

export const SortProvider: React.FC<SortProviderProps> = ({
    children,
    onSortChange
}) => {
    const [sortBy, setSortBy] = useState<SortBy | undefined>();

    const handleSetSortBy = (newSortBy?: SortBy) => {
        setSortBy(newSortBy);
        onSortChange?.(newSortBy);
    };

    const clearSort = () => {
        setSortBy(undefined);
        onSortChange?.(undefined);
    };

    return (
        <SortContext.Provider value={{
            sortBy,
            setSortBy: handleSetSortBy,
            clearSort
        }}>
            {children}
        </SortContext.Provider>
    );
};