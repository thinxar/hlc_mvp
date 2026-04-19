import { useState } from "react";
import { getFinancialYears } from "utils/FormateDate";
import { CaseOverviewCard } from "./card/CaseOverviewCard";
import { AgingAnalysisChart } from "./chart/AgingAnalysisChart";
import { CurrentFinancialYearCaseChart } from "./chart/CurrentFinancialYearCaseChart";
import { DailyTrendCaseChart } from "./chart/DailyTrendCaseChart";
import { FYApprovalComparisonChart } from "./chart/FYApprovalComparisonChart";
import { FYPendingComparisonChart } from "./chart/FYPendingComparisonChart";
import { MonthlyAcceptanceRateChart } from "./chart/MonthlyAcceptanceRateChart";
import { MonthlyTrendCaseChart } from "./chart/MonthlyTrendCaseChart";
import { PendingCasesAging } from "./chart/PendingCasesAging";
import { PreFinancialYearCaseChart } from "./chart/PreFinancialYearCaseChart";
import { TodayCaseBreakdownChart } from "./chart/TodayCaseBreakdownChart";
import { TodayCaseReportChart } from "./chart/TodayCaseReportChart";
import { WeeklyTrendCaseChart } from "./chart/WeeklyTrendCaseChart";
import { DashboardHeader } from "./DashboardHeader";
import AgingDetailsTable from "./grid/AgingDetailsTable";
import { ServiceEndpoint } from "config/ServiceEndpoint";

const CHART_HEIGHT = '450';
const RevivalDashboardPage = () => {
  const { currentFY, previousFY } = getFinancialYears();
  const [filter, setFilter] = useState({ branchName: '', divisionName: '' });

  const endpoint = '/sdf';
  const baseUrl = ServiceEndpoint.customView.rev;
  const overViewEndPoint = baseUrl.cart.summaryView;

  return (
    <div className="p-4 bg-slate-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow mb-3 py-1">
        <DashboardHeader setFilter={setFilter} filter={filter} />
      </div>

      <CaseOverviewCard title="Case Overview" endPoint={overViewEndPoint}
        filter={filter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <div className="dash-cards">
          <MonthlyTrendCaseChart endPoint={endpoint} filter={filter}
            height={CHART_HEIGHT} subText="Pending . Approved"
            title="Monthly Trend - Last 6 Months" xKey="month"
            yKey={["pending", "approved"]} />
        </div>
        <div className="dash-cards">
          <MonthlyAcceptanceRateChart endPoint={endpoint} filter={filter}
            height={CHART_HEIGHT} subText="% of approved cases per month"
            title="Monthly Approval Rate(%) - Last 6 Months" xKey="month"
            yKey={["pending", "approved"]} />
        </div>


        <div className="dash-cards">
          <WeeklyTrendCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending . Approved"
            title="Weekly Trend - Last 7 Weeks" xKey="name"
            yKey={["pending", "approved"]} />
        </div>

        <div className="dash-cards">
          <DailyTrendCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending . Approved"
            title="Daily Trend - Last 7 Days" xKey="name"
            yKey={["pending", "approved"]} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-3">


        <div className="dash-cards">
          <TodayCaseReportChart endPoint={endpoint}
            filter={filter} height={CHART_HEIGHT} subText="Case level document status"
            title="Today's - Approval Summary" xKey="name" yKey="value" />
        </div>

        <div className="dash-cards">
          <TodayCaseBreakdownChart endPoint={endpoint}
            filter={filter} height={CHART_HEIGHT} subText="Case level document status"
            title="Today's - Approval Summary" xKey="name"
            yKey={["pending", "approved"]} />
        </div>

        <div className="dash-cards">
          <AgingAnalysisChart endPoint={endpoint}
            filter={filter} height={CHART_HEIGHT} subText="Number of pending cases by days"
            title="Ageing Analysis" xKey="name" yKey="value" />
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 mt-3">
        <div className="dash-cards">
          <PreFinancialYearCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending . Approved"
            title={`Previous Financial Year (${previousFY})`} xKey="name"
            yKey={["pending", "approved"]} />
        </div>

        <div className="dash-cards">
          <CurrentFinancialYearCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending . Approved"
            title={`Current Financial Year (${currentFY})`} xKey="name"
            yKey={["pending", "approved"]} />
        </div>

        <div className="dash-cards">
          <FYApprovalComparisonChart endPoint={endpoint} subText="Previous FY vs Current FY"
            filter={filter} height={CHART_HEIGHT} title="Approval Summary (Comparative Analysis)"
            xKey="name" yKey={["preApproved", "currApproved"]} />
        </div>
        <div className="dash-cards">
          <FYPendingComparisonChart endPoint={endpoint} subText="Previous FY vs Current FY"
            filter={filter} height={CHART_HEIGHT} title="Pending Summary (Comparative Analysis)"
            xKey="name" yKey={["preApproved", "currApproved"]} />
        </div>
        <div className="dash-cards">
          <PendingCasesAging endPoint={'/PendingCaseAging.json'}
            title="Ageing Bucket Distribution" height={CHART_HEIGHT}
            xKey="Xlabel" yKey={["data"]} subText="Number of Pending cases age buckete" />
        </div>
        <div className="dash-cards">
          <AgingDetailsTable />
        </div>
      </div>
    </div>
  )
}

export { RevivalDashboardPage };

