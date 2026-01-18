import React, { useContext } from "react";
import type { SearchTerm } from "../../../models/search/SearchTerm";
import type { ContextToggle } from "./ContextToggle";

export interface SearchContextValueType extends ContextToggle {
    searchTerm: SearchTerm;
    searchDescriptor: SearchTerm[];
    updateSearchTerm: (searchTerm: string) => void;
    updateSearchColumn: (searchColumn: string) => void;
    disableSearch: boolean
}

export const emptySearchContextValue = {
    isInUse: false,
    searchTerm: { accessor: '', translationKey: '', value: '' },
    searchDescriptor: new Array(0),
    updateSearchTerm: () => { },
    updateSearchColumn: () => { },
    disableSearch: false
};

export const SearchContext = React.createContext<SearchContextValueType>(emptySearchContextValue);

export const useSearch = () => {
    return useContext(SearchContext);
};