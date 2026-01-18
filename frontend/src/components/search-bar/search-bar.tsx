import { useState, type FC } from "react"
import { useSearch } from "../contexts/table/SearchContext"

type searchBarProps = {
    setSearchTerm: (searchTerm: any) => void,
    setSearchColumn: (searhColumn: any) => void,
    cyName?: string
}

const SearchBar: FC<searchBarProps> = ({ setSearchTerm, setSearchColumn }) => {
    const [initialSelectValue, setInitialSelectValue] = useState<any>('');
    const searchContext = useSearch();

    const handleSearch = (newSearchValue: any) => {
        if (searchContext?.isInUse) {
            searchContext.updateSearchTerm(newSearchValue);
        } else {
            setSearchTerm(newSearchValue);
        }
    }

    const handleSearchSelector = (event: any) => {
        if (searchContext?.isInUse) {
            searchContext.updateSearchColumn(event.target.value);
        }
        else {
            setInitialSelectValue(event.target.value)
            setSearchColumn(event.target.value)
        }
    }

    return <></>
}

export default SearchBar;