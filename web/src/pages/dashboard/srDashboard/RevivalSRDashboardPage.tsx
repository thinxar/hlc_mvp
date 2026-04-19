import { useState } from "react";
import { SRDashboardHeader } from "./SRDashboardHeader";
import { TodayCaseOverviewCard } from "./card/TodayCaseOverviewCard";
import { SRTodayCaseReportChart } from "./chart/SRTodayCaseReportChart";
import { SRDailyTrendCaseChart } from "./chart/SRDailyTrendCaseChart";
import { SRTopPendingCaseChart } from "./chart/SRTopPendingCaseChart";
import { SRTopAgePendingCaseChart } from "./chart/SRTopAgePendingCaseChart";

const CHART_HEIGHT = '450';
const RevivalSRDashboardPage = () => {
  const [filter, setFilter] = useState({ srno: '' });

  const endpoint = '/sdf';
  return (
    <div className="p-4 bg-slate-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow mb-3 py-1">
        <SRDashboardHeader setFilter={setFilter} />
      </div>

      <TodayCaseOverviewCard title="Case Overview (Today)" endPoint={"resourceCardApi"}
        filter={filter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <div className="dash-cards">
          <SRTodayCaseReportChart endPoint={endpoint}
            filter={filter} height={CHART_HEIGHT} subText="Case level document status"
            title="Today - Approval Summary" xKey="name" yKey="value" />
        </div>

        <div className="dash-cards">
          <SRDailyTrendCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending . Approved"
            title="Daily Trend - Last 7 Days" xKey="name"
            yKey={["pending", "approved"]} />
        </div>
      </div>

      <div className="grid grid-cols-1  gap-3 mt-3">
        <div className="dash-cards">
          <SRTopPendingCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending Case Count per SR"
            title="Top 20 SRs by Pending Cases" xKey="name"
            yKey={["pending"]} />
        </div>
        <div className="dash-cards">
          <SRTopAgePendingCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending Count per SR for Cases Exceeding 30 Days"
            title="Top 20 SRs by Pending Cases (>30 Days)" xKey="name"
            yKey={["pending"]} />
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 mt-3">


      </div>

    </div>
  )
}

export { RevivalSRDashboardPage }

