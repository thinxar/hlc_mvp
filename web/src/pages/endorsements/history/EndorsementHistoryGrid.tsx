import { ColumnDefinition, IPageQueryable } from "@palmyralabs/rt-forms";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine"
import { useRef } from "react";
import { HclSummaryGridControls } from "src/common/component/gridControl/HlcSummaryGridControls";

const EndorsementHistoryGrid = () => {
    const gridRef = useRef<IPageQueryable>(null);
    const endPoint = '/sds'

    const fields: ColumnDefinition[] = [
        {
            attribute: "endorsement",
            name: "endorsement",
            label: "Endorsement",
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "appliedOn",
            name: "appliedOn",
            label: "Applied On",
            quickSearch: true,
            searchable: true,
            sortable: true,
            type: "date"
        },
        {
            attribute: "approvedBy",
            name: "approvedBy",
            label: "Approved By",
            searchable: true,
            sortable: true,
            type: "string"
        }
    ]

    const getPluginOptions = (): any => {
        return {
            filter: { visible: false },
            add: { visible: false }, export: { visible: false }
        }
    }

    return (
        <div>
            <PalmyraGrid
                columns={fields} pageSize={[15, 30, 45]}
                getPluginOptions={getPluginOptions}
                ref={gridRef}
                DataGridControls={HclSummaryGridControls}
                endPoint={endPoint} initialFetch={false} />
        </div>
    )
}

export { EndorsementHistoryGrid }

