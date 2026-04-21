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
                        title="Top 10 Branch Approval Status" height={CHART_HEIGHT}
                        xKey="Xlabel" yKey={["PE", "AC"]} subText="Pending . Processed" />
                </div>
                <div className="dash-cards">
                    <BottomBranchSummaryChart endPoint={'/bottomBranchSummary.json'} filter={filter}
                        title="Least 10 Branch Approval Status" height={CHART_HEIGHT}
                        xKey="Xlabel" yKey={["PE", "AC"]} subText="Pending . Processed" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 pt-3 ">
                <div className="dash-cards">
                    <TopBranchAppRateChart endPoint={"/TopBranchOverView.json"} title="Overall Summary" height=""
                        xKey="name" yKey={"value"} subText="Pending . Processed" />
                </div>
                <div className="dash-cards">
                    <DoPendingCasesAging endPoint={'/DoPendingCaseAging.json'}
                        title="Ageing Bucket Distribution for all branch" height={CHART_HEIGHT}
                        xKey="Xlabel" yKey={["data"]} subText="Number of Pending cases age bucket" />
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 pt-3">
                <div className="dash-cards">
                    <DoBranchPerformanceChart endPoint={'/DoBranchPerformance.json'} title="Top 10 Branch Pending and In-Progress Status" filter={filter} height=""
                        xKey="branch" yKey={["Pending"]} />
                </div>
                <div className="dash-cards">
                    <BubbleChart />
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