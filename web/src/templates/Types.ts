import type { IEndPoint, MultiEndPoint } from "@palmyralabs/palmyra-wire"
import type { ColumnDefinition, IExportOptions } from "@palmyralabs/rt-forms"



interface IPageInput {
    title?: string,
    pageName: string,
    errorText?: any
}

interface IOptions {
    endPoint: IEndPoint,
    queryOptions?: {
        filter?: any
    },
    endPointVars?: Record<string, any>
    idProperty?: string
}

interface IFormEditInput extends IPageInput {
    id: string,
    children?: any,
    endPoint: string | MultiEndPoint
    // customizer?: IFormCustomizer,
    onSaveSuccess?: (data: any) => void;
    onSaveFailure?: (e: any) => void;
    preSave?: (data: any) => any;
    onDataRefresh?: (data: any) => void
    aclCode?: string
}

interface IDialogFormInput extends IPageInput {
    onRefresh?: () => void
    onClose: () => void
    open: boolean
    size?: number | 'lg' | 'sm' | 'xl' | 'md'
}
interface IFormNewInput extends IPageInput {
    children?: any,
    id?: string,
    endPoint: string
    formListener?: any
    aclCode?: string,
    onSaveSuccess?: (data: any) => void;
    onSaveFailure?: (e: any) => void;
    preSave?: (data: any) => any;
}

interface IFormViewInput extends IPageInput {
    id: string,
    endPoint: string
    children: any
}

interface ISummaryGridInput extends IPageInput {
    options: IOptions,
    fields: ColumnDefinition[],
    pagination?: number[],
    exportOptions?: IExportOptions,
    densityOptions?: any
}

export type {
    IPageInput, IFormEditInput, IFormNewInput,
    IFormViewInput, ISummaryGridInput, IDialogFormInput
}