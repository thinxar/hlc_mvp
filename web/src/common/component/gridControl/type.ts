import { IDataGridDefaultControlConfig, IPluginBtnControl } from "@palmyralabs/rt-forms-mantine"

interface ISummaryControlOptions extends IDataGridDefaultControlConfig {
    onNewClick?: any
    addText?: string
    filterField?: any
    filter?: IPluginBtnControl
    aclCode?: string
}

export type { ISummaryControlOptions }