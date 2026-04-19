import { useState } from "react";
import { DoDashboardHeader } from "./DoDashboardHeader";
import { DoSummaryCard } from "./card/DoSummaryCard";
import { BottomBranchSummary } from "./chart/BottomBranchSummary";
import { TopBranchAppRate } from "./chart/TopBranchAppRate";
import { TopBranchSummary } from "./chart/TopBranchSummary";
import BubbleChart from "./chart/CaseVolumeChart";

const RevivalDODashboardPage = () => {

    const [filter, setFilter] = useState({ branch: '', division: '' });
    const CHART_HEIGHT = '450';

    return (
        <div className="p-4 bg-slate-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow mb-3 py-1">
                <DoDashboardHeader setFilter={setFilter} />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow mb-3 py-1">
                <DoSummaryCard title="Branches Overview" endPoint={"resourceCardApi"}
                    filter={filter} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
                <div className="dash-cards">
                    <TopBranchAppRate endPoint={"/TopBranchOverView.json"} title="Overall Summary" height=""
                        xKey="name" yKey={"value"} subText=". Approved .Pending" />
                </div>
                {/* <div className="dash-cards">
                    <BottomBranchRejRate height="" endPoint={'bottomBranchOverView.json'} title="Bottom 10 Branches Overall Summary"
                        filter={filter} xKey="name" yKey={"value"} subText=". Approved .Pending" />
                </div> */}

                <div className="dash-cards">
                    <TopBranchSummary endPoint={'/topBranchesSummary.json'} filter={filter}
                        title="Top 10 Branch Approval Status" height={CHART_HEIGHT}
                        xKey="Xlabel" yKey={["AC", "PE"]} subText=". Approved .Pending" />
                </div>
                <div className="dash-cards">
                    <BottomBranchSummary endPoint={'/bottomBranchSummary.json'} filter={filter}
                        title="Least 10 Branch Approval Status" height={CHART_HEIGHT}
                        xKey="Xlabel" yKey={["AC", "PE"]} subText=". Approved .Pending" />
                </div>
                <div className="dash-cards">
                    <BubbleChart />
                </div>
            </div>
        </div>
    )
}

export default RevivalDODashboardPage