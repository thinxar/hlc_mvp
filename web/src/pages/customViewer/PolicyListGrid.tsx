import { Button } from "@mantine/core";
import { PalmyraForm, type ColumnDefinition, type IPageQueryable } from "@palmyralabs/rt-forms";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
import { ServiceEndpoint } from "config/ServiceEndpoint";
// import { ServiceEndpoint } from "config/ServiceEndpoint";
import { useEffect, useRef, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { HclSummaryGridControls } from "src/common/component/gridControl/HlcSummaryGridControls";
import { SearchFilterField } from "src/common/component/SearchFilterField";
import { useFilterHandler } from "src/hook/useFilterHandler";
import { IPageInput } from "templates/Types";


const PolicyListGrid = (_props: IPageInput) => {
    const navigate = useNavigate();
    const params = useParams();
    const gridRef = useRef<IPageQueryable>(null);
    const [filter, setFilter] = useState({ policyNo: '' })
    const { handleFilterChange } = useFilterHandler(setFilter);

    const endPoint = ServiceEndpoint.customView.policyListApi +
        "?officeCode=" + params.officeCode + "&srNo=" + params.srNo;

    const fields: ColumnDefinition[] = [
        {
            attribute: "policyNumber",
            name: "policyNumber",
            label: "Policy Number",
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "docType",
            name: "docType",
            label: "Doc Type",
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "srNo",
            name: "srNo",
            label: "SR No",
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "soCode",
            name: "soCode",
            label: "SO Code",
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "doCode",
            name: "doCode",
            label: "DO Code",
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "dateOfSubmission",
            name: "dateOfSubmission",
            label: "Date of Submission",
            searchable: true,
            sortable: true,
            type: "string"
        },
    ];

    const useRefresh = (ms = 1800) => {
        const [loading, setLoading] = useState(false);
        const trigger: any =
            () => {
                if (!loading) {
                    gridRef?.current?.refresh();
                    setLoading(true);
                    setTimeout(() => setLoading(false), ms);
                }
            };
        return [loading, trigger];
    };

    const FilterField: any = <>
        <PalmyraForm>
            <SearchFilterField
                attribute="policyNumber" placeholder="Policy Number"
                filter={filter} setFilter={setFilter} handleFilterChange={handleFilterChange}
            />
        </PalmyraForm>
    </>

    const LightPulse = () => {
        const [l, trigger] = useRefresh();
        return (
            <Button color="#1971c2" onClick={trigger} className="filled-button"
                leftSection={<FiRefreshCw className={l ? "animate-spin" : ""} />}>
                {l ? "Refreshing…" : "Refresh"}
            </Button>
        );
    };

    const getPluginOptions = (): any => {
        return {
            add: { visible: false }, export: { visible: false }, customBtn: LightPulse(),
            backOption: false, filterField: FilterField, filter: { visible: false }
        }
    }

    useEffect(() => {
        gridRef?.current?.setFilter(filter);
    }, [filter]);

    const onRowClick = (d: any) => {
        navigate(`view/${d?.id}`, { state: { policyData: d } });
    };

    return (
        <div className="grid-container">
            <PalmyraGrid title={"Policy List"} onRowClick={onRowClick}
                columns={fields} pageSize={[15, 30, 45]}
                getPluginOptions={getPluginOptions}
                ref={gridRef} pagination={{ ignoreSinglePage: true }}
                DataGridControls={HclSummaryGridControls}
                endPoint={endPoint} />
        </div>
    )
}

export { PolicyListGrid };

