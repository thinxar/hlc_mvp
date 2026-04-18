import { Button } from "@mantine/core";
import { PalmyraForm, type ColumnDefinition, type IPageQueryable } from "@palmyralabs/rt-forms";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
import { topic } from "@palmyralabs/ts-utils";
import { ServiceEndpoint } from "config/ServiceEndpoint";
// import { ServiceEndpoint } from "config/ServiceEndpoint";
import { useEffect, useRef, useState } from "react";
import { FiFileText, FiRefreshCw } from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HclSummaryGridControls } from "src/common/component/gridControl/HlcSummaryGridControls";
import { SearchFilterField } from "src/common/component/SearchFilterField";
import { useFilterHandler } from "src/hook/useFilterHandler";
import { IPageInput } from "templates/Types";
import { useFormstore } from "wire/StoreFactory";
interface IOptions extends IPageInput {
    type: 'rev' | 'and' | 'pbv'
    gridRefX?: any
}

const PolicyListGrid = (props: IOptions) => {
    const { type, gridRefX } = props
    const navigate = useNavigate();
    const gridRef = gridRefX ?? useRef<IPageQueryable>(null);
    const [searchParams] = useSearchParams();

    const [_data, setData] = useState([])
    const [gridData, setGridData] = useState({
        data: [],
        docType: null,
        soCode: null
    });

    const [filter, setFilter] = useState({ policyNumber: '', dos: '' })
    const { handleFilterChange } = useFilterHandler(setFilter);

    const params = new URLSearchParams({
        officecode: searchParams.get("officecode") || "",
        srno: searchParams.get("srno") || ""
    });

    const endPoint = `${ServiceEndpoint.customView[type].policyListApi}?${params.toString()}`;
    const pendencyEndpoint = `${ServiceEndpoint.customView[type].policyPendency}?${params.toString()}`;

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
        // {
        //     attribute: "docType",
        //     name: "docType",
        //     label: "Doc Type",
        //     searchable: true,
        //     type: "string"
        // },
        {
            attribute: "srNo",
            name: "srNo",
            label: "SR No",
            searchable: true,
            type: "string"
        },
        // {
        //     attribute: "soCode",
        //     name: "soCode",
        //     label: "Office Code (SO/BO)",
        //     searchable: true,
        //     type: "string"
        // },
        {
            attribute: "doCode",
            name: "doCode",
            label: "DO Code",
            searchable: true,
            type: "string"
        },
        {
            attribute: "dateOfSubmission",
            name: "dateOfSubmission",
            label: "Date of Submission",
            searchable: true,
            sortable: true,
            type: "string"
        }
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

    // const counts = getCounts(data);

    const toggleFilter = (key: any) => {
        setFilter((prev) => ({
            ...prev,
            dos:
                key === "total" ? ''
                    : prev.dos === key ? '' : key
        }));
    };

    // const HeaderContent: any = <>
    //     <PolicyPendencySummary counts={counts} filter={filter} toggleFilter={toggleFilter} />
    // </>

    const HeaderContent: any = (
        <>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
                    <FiFileText size={13} className="text-blue-500 shrink-0" />
                    <span className="text-xs font-semibold text-blue-400">
                        Doc Type
                    </span>
                    <span className="text-[13px] font-bold text-blue-700 leading-none">
                        {gridData?.docType ?? "—"}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-100 rounded-lg px-3 py-1.5">
                    <LuBuilding2 size={13} className="text-violet-500 shrink-0" />
                    <span className="text-xs font-semibold text-violet-400">
                        Office Code (SO/BO)
                    </span>
                    <span className="text-[13px] font-bold text-violet-700 leading-none">
                        {gridData?.soCode ?? "—"}
                    </span>
                </div>
            </div>
        </>
    );

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
        const handle = topic.subscribe("pendencyKey", (_t: string, data: any) => {
            if (data) {
                toggleFilter?.(data)
            }
        });
        return () => {
            topic.unsubscribe(handle);
        };
    }, []);

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

        navigate(`/app/customViewer/operation?${params.toString()}`, { state: { policyData: d } });
    };

    const onDataChange = (d: any) => {
        setGridData((prev: any) => ({
            data: d,
            docType: prev?.docType || d[0]?.docType,
            soCode: prev?.soCode || d[0]?.soCode
        }));
    };

    return (
        <div className="grid-container">
            <PalmyraGrid title={"Revival Policy List"} onRowClick={onRowClick}
                columns={fields} pageSize={[15, 30, 45]}
                getPluginOptions={getPluginOptions}
                ref={gridRef} pagination={{ ignoreSinglePage: true }}
                DataGridControls={HclSummaryGridControls}
                endPoint={endPoint} onDataChange={onDataChange} />
        </div>
    )
}

export { PolicyListGrid };

