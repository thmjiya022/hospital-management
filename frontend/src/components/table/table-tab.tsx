import { type FC, useState } from 'react';
import Tabs from '../tabs/tabs';
import { TableProvider } from '../../contexts/TableContext';
import Table from './table';
import TableExport from '../table/table-export';
import type { ColumnSchema } from '../../models/ColumnSchema';
import type { TabConfig } from '../../models/TabConfig';
import type { ExportFormat } from '../../models/TableExport';

interface TableTabProps {
    title: string;
    tabs: TabConfig[];
    columns: ColumnSchema[];
    fetchData: (tabId: number, params: any) => Promise<any>;
    onExport?: (tabId: number, format: ExportFormat) => Promise<any>;
}

const TableTab: FC<TableTabProps> = ({
    title,
    tabs,
    columns,
    fetchData,
    onExport,
}) => {
    const [activeTab, setActiveTab] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadData = async (tabId: number, params: any) => {
        setLoading(true);
        try {
            const result = await fetchData(tabId, params);
            setData(result.rows);
            setTotalCount(result.total);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format: ExportFormat) => {
        if (onExport) {
            return await onExport(activeTab, format);
        }

        // Default export data
        return {
            rows: data,
            columns: columns.map(col => ({
                heading: col.heading,
                accessor: col.accessor,
            })),
        };
    };

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header with title and export */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                <TableExport onExport={handleExport} />
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4">
                <Tabs
                    tabs={tabs}
                    value={activeTab}
                    onChange={(index, tab) => {
                        setActiveTab(index);
                        loadData(tab.id, { page: 1, pageSize: 20 });
                    }}
                />
            </div>

            {/* Table */}
            <div className="p-6">
                <TableProvider
                    schemas={columns}
                    data={data}
                    total={totalCount}
                    loading={loading}
                    onSort={(sortBy) => loadData(activeTab, { sortBy, page: 1 })}
                    onFilter={(filters) => loadData(activeTab, { filters, page: 1 })}
                    onPageChange={(page, pageSize) => loadData(activeTab, { page, pageSize })}
                    onExport={handleExport}>
                    <Table />
                </TableProvider>
            </div>
        </div>
    );
};

export default TableTab;