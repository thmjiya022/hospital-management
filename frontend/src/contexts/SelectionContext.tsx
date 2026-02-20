import { createContext, useContext, useState, type ReactNode } from 'react';

interface SelectionContextValue<T = any> {
    selectedItems: T[];
    toggleItem: (item: T) => void;
    selectItem: (item: T) => void;
    deselectItem: (item: T) => void;
    selectAll: (items: T[]) => void;
    clearSelection: () => void;
    isSelected: (item: T) => boolean;
    hasSelection: boolean;
    selectionCount: number;
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined);

export const useSelection = () => {
    const context = useContext(SelectionContext);
    if (!context) throw new Error('useSelection must be used within SelectionProvider');
    return context;
};

interface SelectionProviderProps<T> {
    children: ReactNode;
    items?: T[];
    getItemId?: (item: T) => string | number;
    onSelectionChange?: (selectedItems: T[]) => void;
}

export const SelectionProvider = <T extends any>({
    children,
    getItemId = (item: any) => item.id,
    onSelectionChange,
}: SelectionProviderProps<T>) => {
    const [selectedItems, setSelectedItems] = useState<T[]>([]);

    const handleSelectionChange = (newSelection: T[]) => {
        setSelectedItems(newSelection);
        onSelectionChange?.(newSelection);
    };

    const toggleItem = (item: T) => {
        const isSelected = selectedItems.some(
            selected => getItemId(selected) === getItemId(item)
        );

        if (isSelected) {
            handleSelectionChange(selectedItems.filter(
                selected => getItemId(selected) !== getItemId(item)
            ));
        } else {
            handleSelectionChange([...selectedItems, item]);
        }
    };

    const selectItem = (item: T) => {
        if (!selectedItems.some(selected => getItemId(selected) === getItemId(item))) {
            handleSelectionChange([...selectedItems, item]);
        }
    };

    const deselectItem = (item: T) => {
        handleSelectionChange(selectedItems.filter(
            selected => getItemId(selected) !== getItemId(item)
        ));
    };

    const selectAll = (allItems: T[]) => {
        handleSelectionChange(allItems);
    };

    const clearSelection = () => {
        handleSelectionChange([]);
    };

    const isSelected = (item: T) => {
        return selectedItems.some(selected => getItemId(selected) === getItemId(item));
    };

    return (
        <SelectionContext.Provider value={{
            selectedItems,
            toggleItem,
            selectItem,
            deselectItem,
            selectAll,
            clearSelection,
            isSelected,
            hasSelection: selectedItems.length > 0,
            selectionCount: selectedItems.length,
        }}>
            {children}
        </SelectionContext.Provider>
    );
};