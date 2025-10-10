import { EXPORT_FORMAT } from "@palmyralabs/palmyra-wire";
import { ColumnDefinition, IPageQueryable } from "@palmyralabs/rt-forms";
import { MutableRefObject } from "react";

interface DataGridPluginOptions {
    topic: string;
    getPluginOptions?: () => any;
    quickSearch?: string;
    queryRef: MutableRefObject<IPageQueryable>;
    pageSize?: number | number[];
    columns: ColumnDefinition[];
}

interface SummaryGridPluginOptions extends DataGridPluginOptions {
    newRecord: () => void
    exportOption?: Partial<Record<EXPORT_FORMAT, string>>;
}

export type { SummaryGridPluginOptions }