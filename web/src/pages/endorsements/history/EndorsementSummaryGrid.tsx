import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ColumnDefinition, IPageQueryable } from "@palmyralabs/rt-forms";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine"
import { StringFormat } from "@palmyralabs/ts-utils";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { useRef, useState } from "react";
import { HclSummaryGridControls } from "src/common/component/gridControl/HlcSummaryGridControls";
import { FileViewer } from "src/pages/policySearch/section/FileViewer";

const dateRenderer = (data: any) => {
    const date = data.row.original.createdOn;
    return <>
        <div className="flex items-center gap-2">
            {date.replace('T', ' ')}
        </div>
    </>
}

interface IOptions {
    data: any
}

const EndorsementSummaryGrid = (props: IOptions) => {
    const { data } = props;
    const gridRef = useRef<IPageQueryable>(null);
    const [rData, setrData] = useState<any>()
    const [opened, { open, close }] = useDisclosure(false);

    const endPoint = StringFormat(ServiceEndpoint.policy.endorsement.summary, {
        policyId: data?.id
    })
    const BASE_URL = `${window.location.origin}/api/palmyra`;
    const filePoint = StringFormat(ServiceEndpoint.policy.getFileApi,
        { policyId: rData?.policyId, fileId: rData?.id });
    const pdfUrl = BASE_URL + filePoint;

    const fields: ColumnDefinition[] = [
        {
            attribute: "fileName",
            name: "fileName",
            label: "Endorsement",
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "createdOn",
            name: "createdOn",
            label: "Applied On",
            searchable: true,
            sortable: true,
            type: "string",
            cellRenderer: dateRenderer
        },
        {
            attribute: "createdBy",
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

    const onRowClick = (d: any) => {
        console.log(d);
        setrData(d);
        open();
    }

    return (
        <div>
            <PalmyraGrid onDataChange={(d) => console.log(d)}
                columns={fields} pageSize={[15, 30, 45]}
                getPluginOptions={getPluginOptions}
                ref={gridRef} onRowClick={onRowClick}
                DataGridControls={HclSummaryGridControls}
                endPoint={endPoint} />

            <Modal opened={opened} onClose={close} centered size={"xl"} title="Endorsement">
                <FileViewer file={rData} fileUrl={pdfUrl} key={rData?.id} />
            </Modal>
        </div>
    )
}

export { EndorsementSummaryGrid }

