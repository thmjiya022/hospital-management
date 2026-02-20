import type { FC } from "react";
import type { LucideIcon } from 'lucide-react'

interface TabProps {
    name: string;
    icon?: LucideIcon;
    selected: boolean;
    onClick: () => void;
}

const Tab: FC<TabProps> = ({ name, icon: Icon, selected, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            data-cy="tab"
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded-sm ${selected ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`}
            aria-selected={selected}
            role="tab">
                {Icon && <Icon className={`w-4 h-4 shrink-0 transition-colors duration-150 ${selected ? 'text-gray-900' : 'text-gray-400'}`} />}
                <span>{name}</span>
                {selected && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" aria-hidden="true"/>}  
        </button>
    );
};

export default Tab;