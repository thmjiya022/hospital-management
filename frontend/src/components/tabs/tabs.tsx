import { useState, type FC } from "react";
import Tab from "../tab/tab";
import { type TabConfig } from "../../models/TabConfig";

interface TabsProps {
    tabs: TabConfig[];
    defaultIndex?: number;
    value?: number;
    onChange?: (index: number, tab: TabConfig) => void;
    className?: string;
}

export const Tabs: FC<TabsProps> = ({ tabs, defaultIndex = 0, value, onChange, className = '' }) => {
    const [internalIndex, setInternalIndex] = useState(defaultIndex);
    const isControlled = value !== undefined;
    const activeIndex = isControlled ? value : internalIndex;

    const handleClick = (index: number, tab: TabConfig) => {
        if (!isControlled) setInternalIndex(index);
        onChange?.(index, tab);
    };

    return (
        <div role="tablist" aria-label="tabs" className={`flex items-end gap-1 border-b border-gray-200 ${className}`}>
            {tabs.map((tab, index) => 
                <Tab 
                    key={tab.id} 
                    name={tab.name} 
                    icon={tab.icon} 
                    selected={activeIndex === index}
                    onClick={() => handleClick(index, tab)}/>)}
        </div>
    );
};

export default Tabs;