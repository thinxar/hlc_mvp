import { useState } from "react";
import { DoDashboardHeader } from "./DoDashboardHeader";
import { DoDocumentOverviewCard } from "./card/DoDocumentOverviewCard";
import { BottomBranchSummaryChart } from "./chart/BottomBranchSummaryChart";
import BubbleChart from "./chart/CaseVolumeChart";
import { DoBranchPerformanceChart } from "./chart/DoBranchPerformanceChart";
import { DoMonthWiseRadioChart } from "./chart/DoMonthWiseRadioChart";
import { DoPendingCasesAging } from "./chart/DoPendingCasesAging";
import { TopBranchAppRateChart } from "./chart/TopBranchAppRateChart";
import { TopBranchSummaryChart } from "./chart/TopBranchSummaryChart";
import { TopBranchApprovalRateChart } from "./chart/TopBranchApprovalRateChart";
import { TopBranchPendingRateChart } from "./chart/TopBranchPendingRateChart";

const RevivalDODashboardPage = () => {
    const [filter, setFilter] = useState({ branch: '', division: '' });
    const CHART_HEIGHT = '450';

    return (
        <div className="p-4 bg-slate-50 dark:bg-gray-900 px-5">
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow mb-3 py-1">
                <DoDashboardHeader setFilter={setFilter} />
            </div>

            <DoDocumentOverviewCard title="Branches Overview" endPoint={"resourceCardApi"}
                filter={filter} />


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
                <div className="dash-cards">
                    <TopBranchSummaryChart endPoint={'/topBranchesSummary.json'} filter={filter}
                        title="Top 10 - Higher Approval Rate" height={CHART_HEIGHT}
                        xKey="Xlabel" yKey={["PE", "AC"]} subText="Pending . Processed" />
                </div>
                <div className="dash-cards">
                    <BottomBranchSummaryChart endPoint={'/bottomBranchSummary.json'} filter={filter}
                        title="Bottom 10 - Lowest Approval Rate" height={CHART_HEIGHT}
                        xKey="Xlabel" yKey={["PE", "AC"]} subText="Pending . Processed" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 pt-3 ">
                <div className="dash-cards">
                    <TopBranchAppRateChart endPoint={"/TopBranchOverView.json"} title="Overall Summary" height=""
                        xKey="name" yKey={"value"} subText="Pending . Processed" />
                </div>
                <div className="dash-cards">
                    <TopBranchApprovalRateChart endPoint={'/top5BranchesSummary.json'} filter={filter}
                        title="Top 5 Higher Approval Rate - Last 6 months" height={CHART_HEIGHT}
                        xKey="branch" yKey={["processed"]} subText="Processed document summary" />
                </div>
                <div className="dash-cards">
                    <TopBranchPendingRateChart endPoint={'/top5BranchesPenSummary.json'} filter={filter}
                        title="Top 5 Higher Pending Rate - Last 6 months" height={CHART_HEIGHT}
                        xKey="branch" yKey={["pending"]} subText="Pending document summary" />
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[70%_30%]
             lg:grid-cols-[70%_30%] gap-3 pt-3">
                <div className="dash-cards">
                    <DoBranchPerformanceChart endPoint={'/DoBranchPerformance.json'}
                        title="Top 10 - Higher Pending Rate" filter={filter} height={CHART_HEIGHT}
                        xKey="branch" yKey={["Pending"]} subText="Pending summary by branches" />
                </div>
                <div className="dash-cards">
                    <DoPendingCasesAging endPoint={'/DoPendingCaseAging.json'}
                        title="Ageing Bucket Distribution for all branch" height={CHART_HEIGHT}
                        xKey="Xlabel" yKey={["data"]} subText="Number of Pending cases age bucket" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-3">
                <div className="dash-cards">
                    <BubbleChart endPoint="/s" height={CHART_HEIGHT} title="Branch Performance"
                        subText="Pending . Processed" xKey="" yKey={''} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 py-3">
                <div className="dash-cards">
                    <DoMonthWiseRadioChart endPoint={'/doCaseAndDocument.json'} filter={filter}
                        height={CHART_HEIGHT} subText="% of approved cases per month"
                        title="Branch Approval Summary (Last 6-Month)" xKey="month"
                        yKey={["pending", "approved"]} />
                </div>
            </div>
        </div>
    )
}

export default RevivalDODashboardPage