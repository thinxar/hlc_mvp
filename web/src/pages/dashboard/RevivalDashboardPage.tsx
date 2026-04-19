import { useState } from "react";
import { CaseOverviewCard } from "./card/CaseOverviewCard"
import { MonthlyTrendCaseChart } from "./chart/MonthlyTrendCaseChart";
import { MonthlyAcceptanceRateChart } from "./chart/MonthlyAcceptanceRateChart";
import { TodayCaseReportChart } from "./chart/TodayCaseReportChart";
import { WeeklyTrendCaseChart } from "./chart/WeeklyTrendCaseChart";
import { DailyTrendCaseChart } from "./chart/DailyTrendCaseChart";
import { TodayCaseBreakdownChart } from "./chart/TodayCaseBreakdownChart";
import { PreFinancialYearCaseChart } from "./chart/PreFinancialYearCaseChart";
import { CurrentFinancialYearCaseChart } from "./chart/CurrentFinancialYearCaseChart";
import { getFinancialYears } from "utils/FormateDate";
import { AgingAnalysisChart } from "./chart/AgingAnalysisChart";
import { DashboardHeader } from "./DashboardHeader";
import { CurrentYearBranchStatus } from "./chart/CurrentYearBranchStatus";
import { PendingCasesAging } from "./chart/PendingCasesAging";
import AgingDetailsTable from "./grid/AgingDetailsTable";
import { FYApprovalComparisonChart } from "./chart/FYApprovalComparisonChart";
import { FYPendingComparisonChart } from "./chart/FYPendingComparisonChart";

const CHART_HEIGHT = '450';
const RevivalDashboardPage = () => {
  const { currentFY, previousFY } = getFinancialYears();
  const [filter, setFilter] = useState({ branch: '', division: '' });

  const endpoint = '/sdf';
  return (
    <div className="p-4 bg-slate-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow mb-3 py-1">
        <DashboardHeader setFilter={setFilter} />
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-3">


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
          <AgingAnalysisChart endPoint={endpoint}
            filter={filter} height={CHART_HEIGHT} subText="Number of pending cases by age"
            title="Aging Analysis" xKey="name" yKey="value" />
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 mt-3">
        <div className="dash-cards">
          <PreFinancialYearCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending . Approved . Rejected"
            title={`Previous Financial Year (${previousFY})`} xKey="name"
            yKey={["pending", "approved", "rejected"]} />
        </div>

        <div className="dash-cards">
          <CurrentFinancialYearCaseChart endPoint={endpoint}
            height={CHART_HEIGHT} subText="Pending . Approved . Rejected"
            title={`Current Financial Year (${currentFY})`} xKey="name"
            yKey={["pending", "approved", "rejected"]} />
        </div>

        <div className="dash-cards">
          <FYApprovalComparisonChart endPoint={endpoint} subText="Prv FY vs Current FY approved cases"
            filter={filter} height={CHART_HEIGHT} title="FY-over-Year Approval Summary"
            xKey="name" yKey={["preApproved", "currApproved"]} />
        </div>
        <div className="dash-cards">
          <FYPendingComparisonChart endPoint={endpoint} subText="Prv FY vs Current FY pending cases"
            filter={filter} height={CHART_HEIGHT} title="FY-over-Year Pending Summary"
            xKey="name" yKey={["preApproved", "currApproved"]} />
        </div>

        <div className="dash-cards">
          <CurrentYearBranchStatus endPoint={'/cYearBranchStatus.json'}
            title="Branch-wise Accepted and Pending ( Current FY )" height={CHART_HEIGHT}
            xKey="Xlabel" yKey={["PE", "AC", "RJ"]} subText="Pending . Approved . Rejected" />
        </div>
        <div className="dash-cards">
          <PendingCasesAging endPoint={'/PendingCaseAging.json'}
            title="Aging Bucket Distribution" height={CHART_HEIGHT}
            xKey="Xlabel" yKey={["data"]} subText="Number of Pending cases age buckete" />
        </div>
        <div className="dash-cards">
          <AgingDetailsTable />
        </div>

      </div>

    </div>
  )
}

export { RevivalDashboardPage }

