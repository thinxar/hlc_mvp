import { Button } from "@mantine/core";
import { PalmyraForm, type ColumnDefinition, type IPageQueryable } from "@palmyralabs/rt-forms";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
import { ServiceEndpoint } from "config/ServiceEndpoint";
// import { ServiceEndpoint } from "config/ServiceEndpoint";
import { useEffect, useRef, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HclSummaryGridControls } from "src/common/component/gridControl/HlcSummaryGridControls";
import { SearchFilterField } from "src/common/component/SearchFilterField";
import { useFilterHandler } from "src/hook/useFilterHandler";
import { IPageInput } from "templates/Types";
import { getCounts, getDaysBetweenDates } from "utils/FormateDate";
import { useFormstore } from "wire/StoreFactory";
import PolicyPendencySummary from "./PolicyPendencySummary";

const colorMap: Record<string, string> = {
    '<3 Days': 'text-green-600 bg-green-100',
    '3-10 Days': 'text-orange-600 bg-orange-100',
    '>10 Days': 'text-red-600 bg-red-100',
};

const dotColorMap: Record<string, string> = {
    '<3 Days': 'bg-green-500',
    '3-10 Days': 'bg-orange-500',
    '>10 Days': 'bg-red-500',
};

const calculatePendingDays = (data: any) => {
    const d = data?.row?.original;
    if (!d?.dateOfSubmission) return "-";
    const submittedDate = new Date(d.dateOfSubmission);
    const currentDate = new Date();

    if (isNaN(submittedDate.getTime())) return "-";

    const days = getDaysBetweenDates(submittedDate, currentDate, true)

    const getLabel = (days: number): string => {
        if (days <= 3) return '<3 Days';
        if (days <= 10) return '3-10 Days';
        return '>10 Days';
    };

    const label = getLabel(Number(days));
    const textColor = colorMap[label];
    const dotColor = dotColorMap[label];
    return (
        <span className={`flex items-center gap-1.5 w-fit rounded-3xl px-2 ${textColor}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {`${days}`}
        </span>
    )

};

interface IOptions extends IPageInput {
    type: 'rev' | 'and' | 'pbv'
}

const PolicyListGrid = (props: IOptions) => {
    const { type } = props
    const navigate = useNavigate();
    const gridRef = useRef<IPageQueryable>(null);
    const [searchParams] = useSearchParams();

    const [data, setData] = useState([])
    const [filter, setFilter] = useState({ policyNumber: '', pendency: '' })
    const { handleFilterChange } = useFilterHandler(setFilter);

    const params = new URLSearchParams({
        officecode: searchParams.get("officecode") || "",
        srno: searchParams.get("srno") || ""
    });

    const endPoint = `${ServiceEndpoint.customView[type].policyListApi}?${params.toString()}`;
    const pendencyEndpoint = ServiceEndpoint.customView[type].policyPendency;

    useEffect(() => {
        useFormstore(pendencyEndpoint, {}, '').get({}).then((d: any) => {
            setData(d);
        });
    }, []);


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
            label: "Office Code",
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
        {
            attribute: "pendingSince",
            name: "pendingSince",
            label: "Pending Since (Days)",
            type: "string",
            cellRenderer: calculatePendingDays
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

    const counts = getCounts(data);

    const toggleFilter = (key: any) => {
        setFilter((prev) => ({
            ...prev,
            pendency:
                key === "total" ? ''
                    : prev.pendency === key ? '' : key
        }));
    };

    const HeaderContent: any = <>
        <PolicyPendencySummary counts={counts} filter={filter} toggleFilter={toggleFilter} />
    </>

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
            backOption: false, filterField: FilterField, filter: { visible: false },
            headerContent: HeaderContent
        }
    }

    useEffect(() => {
        gridRef?.current?.setFilter(filter);
    }, [filter]);

    const onRowClick = (d: any) => {
        const params = new URLSearchParams({
            policyno: d?.policyNumber || d?.id,
            officecode: searchParams.get("officecode") || "",
            srno: searchParams.get("srno") || "",
            appname: searchParams.get("appname") || "",
            asrno: searchParams.get("asrno") ?? "null"
        });

        navigate(`/CustomViewer/operation?${params.toString()}`, { state: { policyData: d } });
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

