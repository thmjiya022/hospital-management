import type SearchFlag from "./SearchFlag";

export interface SearchTerm extends SearchFlag {
    heading?: string,
    accessor: string,
    value?: string,
    translationKey: string,
};
