import { useState } from "react";
import { CaseOverviewCard } from "./card/CaseOverviewCard"
import { MonthlyTrendCaseChart } from "./chart/MonthlyTrendCaseChart";
import { MonthlyAcceptanceRateChart } from "./chart/MonthlyAcceptanceRateChart";
import { TodayCaseReportChart } from "./chart/TodayCaseReportChart";
import { WeeklyTrendCaseChart } from "./chart/WeeklyTrendCaseChart";
import { DailyTrendCaseChart } from "./chart/DailyTrendCaseChart";
import { TodayCaseBreakdownChart } from "./chart/TodayCaseBreakdownChart";

const CHART_HEIGHT = '450';
const RevivalDashboardPage = () => {
  const [filter, _setFilter] = useState({ branch: '' });

  const endpoint = '/sdf';
  return (
    <div className="p-4">
      <CaseOverviewCard title="Case Overview" endPoint={"resourceCardApi"}
        filter={filter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <div className="dash-cards">
          <MonthlyTrendCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending . Approved . Rejected"
            title="Monthly Trend - Last 6 Months" xKey="month"
            yKey={["pending", "approved", "rejected"]} />
        </div>
        <div className="dash-cards">
          <MonthlyAcceptanceRateChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="% of approved cased per month"
            title="Monthly Acceptance Rate(%) - Last 6 Months" xKey="month"
            yKey="value" />
        </div>
        <div className="dash-cards">
          <TodayCaseReportChart endPoint={endpoint}
            filter={filter} height={CHART_HEIGHT} subText="Case level document status"
            title="Today - Approval Summary" xKey="name" yKey="value" />
        </div>

        <div className="dash-cards">
          <TodayCaseBreakdownChart endPoint={endpoint}
            filter={filter} height={CHART_HEIGHT} subText="Case level document status"
            title="Today - Approval Summary" xKey="name"
            yKey={["pending", "approved", "rejected"]} />
        </div>

        <div className="dash-cards">
          <WeeklyTrendCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending . Approved . Rejected"
            title="Weekly Trend - Last 7 Weeks" xKey="name"
            yKey={["pending", "approved", "rejected"]} />
        </div>

        <div className="dash-cards">
          <DailyTrendCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending . Approved . Rejected"
            title="Daily Trend - Last 7 Days" xKey="name"
            yKey={["pending", "approved", "rejected"]} />
        </div>
      </div>
    </div>
  )
}

export { RevivalDashboardPage }

