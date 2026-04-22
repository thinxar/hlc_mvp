import { useState } from "react";
import { DoDashboardHeader } from "./DoDashboardHeader";
import { DoDocumentOverviewCard } from "./card/DoDocumentOverviewCard";
import { BottomBranchSummaryChart } from "./chart/BottomBranchSummaryChart";
import BubbleChart from "./chart/CaseVolumeChart";
import { DoBranchPerformanceChart } from "./chart/DoBranchPerformanceChart";
import { DoMonthWiseRadioChart } from "./chart/DoMonthWiseRadioChart";
import { DoPendingCasesAging } from "./chart/DoPendingCasesAging";
import { TopBranchApprovalRateChart } from "./chart/TopBranchApprovalRateChart";
import { TopBranchPendingRateChart } from "./chart/TopBranchPendingRateChart";
import { TopBranchSummaryChart } from "./chart/TopBranchSummaryChart";
import { ServiceEndpoint } from "config/ServiceEndpoint";

const CHART_HEIGHT = '450';
const RevivalDODashboardPage = () => {
    const [filter, setFilter] = useState<any>({ doCode: '201', window: '6' });

    const revivalDoDashboardUrl = ServiceEndpoint.customView.rev.doDashboard
    const processedDocumentApi = revivalDoDashboardUrl.processedDocApprovalApi
    const pendingDocumentApi = revivalDoDashboardUrl.pendingDocApprovalApi

    const top10HighApprovalApi = `${processedDocumentApi}`;
    const bottom10HighApprovalApi = `${processedDocumentApi}?order=bottom`;
    const top10HighPendingApi = `${pendingDocumentApi}`;

    const top5HighProcessedRateApi = `${revivalDoDashboardUrl.processedRatioApi}?count=5`;
    const top5HighPendingRateApi = `${revivalDoDashboardUrl.pendingRatioApi}?count=5`;
    const divisionBranchesApi = `${revivalDoDashboardUrl.divisionBranchesApi}`;
    const divisionPerformanceApi = `${revivalDoDashboardUrl.divisionPerformanceApi}`;
    const branchOverviewApi = `${revivalDoDashboardUrl.branchOverviewApi}`;
    const docAgingApi = `${revivalDoDashboardUrl.ageingApi}`;
    return (
        <div className="p-4 bg-slate-50 dark:bg-gray-900 px-5">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-3 py-1 
             sticky top-0 z-50">
                <DoDashboardHeader setFilter={setFilter} />
            </div>

            <DoDocumentOverviewCard title="Branches Overview" endPoint={branchOverviewApi}
                filter={filter} />


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
                <div className="dash-cards">
                    <TopBranchSummaryChart endPoint={top10HighApprovalApi} filter={filter}
                        title="Top 10 - Higher Approval Rate" height={CHART_HEIGHT}
                        xKey="branchName" yKey={["pendingDocuments", "processedDocuments"]} subText="Pending . Processed" />
                </div>
                <div className="dash-cards">
                    <BottomBranchSummaryChart endPoint={bottom10HighApprovalApi} filter={filter}
                        title="Bottom 10 - Lowest Approval Rate" height={CHART_HEIGHT}
                        xKey="branchName" yKey={["pendingDocuments", "processedDocuments"]} subText="Pending . Processed" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 pt-3 ">
                {/* <div className="dash-cards">
                    <TopBranchAppRateChart endPoint={"/TopBranchOverView.json"} title="Overall Summary" height=""
                        xKey="name" yKey={"value"} subText="Pending . Processed" />
                </div> */}
                <div className="dash-cards">
                    <TopBranchApprovalRateChart endPoint={top5HighProcessedRateApi} filter={filter}
                        title="Top 5 Higher Approval Rate" height={CHART_HEIGHT}
                        xKey="branchName" yKey={["ratioPercent"]} subText="Processed document summary" />
                </div>
                <div className="dash-cards">
                    <TopBranchPendingRateChart endPoint={top5HighPendingRateApi} filter={filter}
                        title="Top 5 Higher Pending Rate" height={CHART_HEIGHT}
                        xKey="branchName" yKey={["ratioPercent"]} subText="Pending document summary" />
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[70%_30%]
             lg:grid-cols-[70%_30%] gap-3 pt-3 pr-3">
                <div className="dash-cards">
                    <DoBranchPerformanceChart endPoint={top10HighPendingApi}
                        title="Top 10 - Higher Pending Rate" filter={filter} height={CHART_HEIGHT}
                        xKey="branchName" yKey={["pendingDocuments"]} subText="Pending summary by branches" />
                </div>
                <div className="dash-cards">
                    <DoPendingCasesAging endPoint={docAgingApi} filter={filter}
                        title="Ageing Summary" height={CHART_HEIGHT}
                        xKey="name" yKey={"value"} subText="Pending documents age distribution" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-3">
                <div className="dash-cards">
                    <BubbleChart endPoint={divisionBranchesApi} height={CHART_HEIGHT} title="Division Performance"
                        subText="Pending . Processed" xKey="" yKey={''} filter={filter} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 py-3">
                <div className="dash-cards">
                    <DoMonthWiseRadioChart endPoint={divisionPerformanceApi} filter={filter}
                        height={CHART_HEIGHT} subText="% of processed documents per month"
                        title="Approval Summary" xKey="calMonth"
                        yKey={["pendingPercentage", "processedPercentage"]} />
                </div>
            </div>
        </div>
    )
}

export default RevivalDODashboardPage