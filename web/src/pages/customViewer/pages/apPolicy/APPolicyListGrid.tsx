import { type ColumnDefinition, type IPageQueryable } from "@palmyralabs/rt-forms";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
import { topic } from "@palmyralabs/ts-utils";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { HclSummaryGridControls } from "src/common/component/gridControl/HlcSummaryGridControls";
import { IPageInput } from "templates/Types";

interface IOptions extends IPageInput {
    type: 'rev' | 'and' | 'pbv'
}

const APPolicyListGrid = (props: IOptions) => {
    const { type } = props
    const gridRef = useRef<IPageQueryable>(null);
    const [searchParams] = useSearchParams();

    const params = new URLSearchParams({
        officecode: searchParams.get("officecode") || "",
        year: searchParams.get("year") || ""
    });

    const endPoint = `${ServiceEndpoint.customView[type].policyListApi}?${params.toString()}`;

    const fields: ColumnDefinition[] = [
        {
            attribute: "proposalNo",
            name: "proposalNo",
            label: "Proposal No",
            searchable: true,
            sortable: true,
            type: "string"
        }
    ];

    const getPluginOptions = (): any => {
        return {
            add: { visible: false }, export: { visible: false },
            backOption: false, filter: { visible: false }
        }
    }

    const onRowClick = (d: any) => {
        topic.publish('proposalNo', d?.proposalNo)
    };

    const title = type == 'and' ? 'Ananda' : 'Policy Bazaar';
    return (
        <div className="grid-container policy-grid bg-white">
            <PalmyraGrid onRowClick={onRowClick} title={title}
                columns={fields} pageSize={[15, 30, 45]}
                getPluginOptions={getPluginOptions}
                ref={gridRef} pagination={{ ignoreSinglePage: true }}
                DataGridControls={HclSummaryGridControls}
                endPoint={endPoint} />
        </div>
    )
}

export { APPolicyListGrid };

