import Gutter from "src/common/component/SectionBreak"
import { IPageInput } from "templates/Types"
import { PolicyListGrid } from "./PolicyListGrid"
import { useSearchParams } from "react-router-dom";
import { APPolicyViewPage } from "./pages/apPolicy/APPolicyViewPage";
import { DoCodePolicyChart } from "./chart/DoCodePolicyChart";
import { DocumentPendencyChart } from "./chart/DocumentPendencyChart";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import PolicyPendencySummary from "./PolicyPendencySummary";
import { useEffect, useRef, useState } from "react";
import { useFormstore } from "wire/StoreFactory";
import { getCounts } from "utils/FormateDate";

const CHART_HEIGHT = '300';
const CustomViewerPage = (props: IPageInput) => {
    const gridRef = useRef<any>(null);

    const [searchParams] = useSearchParams();
    const [data, setData] = useState([])
    const appName = searchParams.get("appname");

    const params = new URLSearchParams({
        officecode: searchParams.get("officecode") || "",
        srno: searchParams.get("srno") || ""
    });

    useEffect(() => {
        useFormstore(pendencyEndpoint, {}, '').get({}).then((d: any) => {
            setData(d);
        });
    }, []);

    const pendencyEndpoint = `${ServiceEndpoint.customView.rev.policyPendency}?${params.toString()}`;
    const approvalSummaryApi = `${ServiceEndpoint.customView.rev.chart.doCodeSummary}?${params.toString()}`
    const docPendencyApi = `${ServiceEndpoint.customView.rev.chart.docPendency}?${params.toString()}`

    const counts = getCounts(data);
    return (
        appName == 'REV' ? (
            <Gutter>
                <div className="flex  gap-2 p-3 overflow-hidden">
                    <div className="w-[70%] shadow rounded-lg">
                        <div className="px-1 pt-1">
                            <PolicyPendencySummary counts={counts} />
                        </div>
                        <PolicyListGrid pageName={props.pageName} type="rev" gridRefX={gridRef} />
                    </div>
                    <div className="w-[30%] space-y-2">
                        <div className="dash-cards">
                            <DocumentPendencyChart endPoint={docPendencyApi}
                                height={CHART_HEIGHT} subText="Pending policy summary"
                                title="Pendency Report" xKey="name" yKey="value" />
                        </div>
                        <div className="dash-cards">
                            <DoCodePolicyChart endPoint={approvalSummaryApi}
                                height={CHART_HEIGHT} subText="DO code wise summary"
                                title="Policy (DO Code wise)" xKey="name" yKey="value" />
                        </div>
                    </div>
                </div>
            </Gutter >
        ) : (

            <APPolicyViewPage />
        )
    )
}

export { CustomViewerPage }

