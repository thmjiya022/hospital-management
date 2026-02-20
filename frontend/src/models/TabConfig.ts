import type { LucideIcon } from 'lucide-react'

export interface TabConfig {
    id: number;
    name: string;
    icon?: LucideIcon;
    columnId?: number;
}