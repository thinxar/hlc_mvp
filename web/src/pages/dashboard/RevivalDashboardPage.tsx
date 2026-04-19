import { useState } from "react";
import { CaseOverviewCard } from "./card/CaseOverviewCard"
import { MonthlyTrendCaseChart } from "./chart/MonthlyTrendCaseChart";

const CHART_HEIGHT = '450';
const RevivalDashboardPage = () => {
  const [filter, _setFilter] = useState({ branch: '' });

  return (
    <div className="p-4">
      <CaseOverviewCard title="Case Overview" endPoint={"resourceCardApi"}
        filter={filter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <div className="dash-cards">
          <MonthlyTrendCaseChart endPoint={'/s'}
            height={CHART_HEIGHT} subText="Pending . Approved . Rejected"
            title="Monthly Trend - Last 6 Months" xKey="month"
            yKey={["pending", "approved", "rejected"]} />
        </div>
      </div>
    </div>
  )
}

export { RevivalDashboardPage }

