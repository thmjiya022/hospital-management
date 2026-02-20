import { type FC } from 'react';
import { useTable } from '../../contexts/TableContext';
import { GripVertical, Eye, EyeOff, X } from 'lucide-react';

interface TableMenuProps {
    onClose: () => void;
}

const TableMenu: FC<TableMenuProps> = ({ onClose }) => {
    const { schemas, metas, updateColumnMeta } = useTable();

    const toggleColumn = (key: string) => {
        const meta = metas.find(m => m.key === key);
        updateColumnMeta(key, { visible: !meta?.visible });
    };

    const resetToDefault = () => {
        schemas.forEach(schema => {
            const meta = metas.find(m => m.key === schema.key);
            if (meta && meta.isDefault !== meta.visible) {
                updateColumnMeta(schema.key, { visible: meta.isDefault });
            }
        });
    };

    const visibleCount = metas.filter(m => m.visible).length;
    const totalCount = schemas.length;

    return (
        <>
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b">
                    <div>
                        <h3 className="font-medium">Customize Columns</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {visibleCount} of {totalCount} visible
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Column list */}
                <div className="max-h-96 overflow-y-auto py-2">
                    {schemas.map(schema => {
                        const meta = metas.find(m => m.key === schema.key);
                        const isVisible = meta?.visible !== false;

                        return (
                            <div
                                key={schema.key}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 group"
                            >
                                <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                <button
                                    onClick={() => toggleColumn(schema.key)}
                                    className="flex items-center gap-2 flex-1 text-left"
                                >
                                    {isVisible
                                        ? <Eye className="w-4 h-4 text-blue-600" />
                                        : <EyeOff className="w-4 h-4 text-gray-400" />
                                    }
                                    <span className="text-sm flex-1">{schema.heading}</span>
                                </button>
                                {meta?.isDefault && (
                                    <span className="text-xs text-gray-400">default</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-3 border-t bg-gray-50 rounded-b-lg">
                    <button
                        onClick={resetToDefault}
                        className="w-full px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                        Reset to Default
                    </button>
                </div>
            </div>
        </>
    );
};

export default TableMenu;