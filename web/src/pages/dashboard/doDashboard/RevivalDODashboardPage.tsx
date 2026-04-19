import { useState } from "react";
import { DoDashboardHeader } from "./DoDashboardHeader";
import { CurrentYearBranchAging } from "./chart/CurrentYearBranchAging";
import DoCurrentFYSummary from "./chart/DoCurrentFYSummary";
import DoTodayCaseSummaryChart from "./chart/DoTodayCaseSummaryChart";

const RevivalDODashboardPage = () => {

    const [filter, setFilter] = useState({ branch: '', division: '' });
    const CHART_HEIGHT = '450';

    return (
        <div className="p-4 bg-slate-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow mb-3 py-1">
                <DoDashboardHeader setFilter={setFilter} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
                <div className="dash-cards">
                    <CurrentYearBranchAging endPoint={'/CyearBranchStatus.json'}
                        title="Overall Status - Top 10 Branch ( Current FY )" height={CHART_HEIGHT}
                        xKey="Xlabel" yKey={["PE", "AC"]} subText="Pending . Approved" />
                </div>
                <div className="dash-cards">
                    <DoTodayCaseSummaryChart endPoint={'/doTodayCaseReport.json'}
                        filter={filter} height={CHART_HEIGHT} subText="Case level document status"
                        title="Today - Approval Summary" xKey="name" yKey="value" />
                </div>
                <div className="dash-cards">
                    <DoCurrentFYSummary />
                </div>
            </div>
        </div>
    )
}

export default RevivalDODashboardPage