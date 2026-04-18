import Gutter from "src/common/component/SectionBreak"
import { IPageInput } from "templates/Types"
import { PolicyListGrid } from "./PolicyListGrid"
import { useSearchParams } from "react-router-dom";
import { APPolicyViewPage } from "./pages/apPolicy/APPolicyViewPage";
import { DocumentApprovalChart } from "./chart/DocumentApprovalChart";
import { DocumentPendencyChart } from "./chart/DocumentPendencyChart";
import { ServiceEndpoint } from "config/ServiceEndpoint";

const CHART_HEIGHT = '300';
const CustomViewerPage = (props: IPageInput) => {
    const [searchParams] = useSearchParams();
    const appName = searchParams.get("appname");

    const params = new URLSearchParams({
        officecode: searchParams.get("officecode") || "",
        srno: searchParams.get("srno") || ""
    });

    const approvalSummaryApi = `${ServiceEndpoint.customView.rev.chart.approvalSummary}?${params.toString()}`
    const docPendencyApi = `${ServiceEndpoint.customView.rev.chart.docPendency}?${params.toString()}`

    return (
        appName == 'REV' ? (
            <Gutter>
                <div className="flex  gap-2 p-3 overflow-hidden">
                    <div className="w-[80%] shadow rounded-lg">
                        <PolicyListGrid pageName={props.pageName} type="rev" />
                    </div>
                    <div className="w-[20%] space-y-2">
                        <div className="dash-cards">
                            <DocumentPendencyChart endPoint={docPendencyApi}
                                height={CHART_HEIGHT} subText="Pending policy summary"
                                title="Policy Pendency" xKey="name" yKey="value" />
                        </div>
                        <div className="dash-cards">
                            <DocumentApprovalChart endPoint={approvalSummaryApi}
                                height={CHART_HEIGHT} subText="Document approval summary"
                                title="Document Approval" xKey="name" yKey="value" />
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

