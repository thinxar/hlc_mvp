import { ServiceEndpoint } from "config/ServiceEndpoint";
import { useState } from "react";
import { getDate, getDateRange, getFinancialYears } from "utils/FormateDate";
import { CaseOverviewCard } from "./card/CaseOverviewCard";
import { AgingAnalysisChart } from "./chart/AgingAnalysisChart";
import { CurrentFinancialYearCaseChart } from "./chart/CurrentFinancialYearCaseChart";
import { DailyTrendCaseChart } from "./chart/DailyTrendCaseChart";
import { FYApprovalComparisonChart } from "./chart/FYApprovalComparisonChart";
import { MonthlyAcceptanceRateChart } from "./chart/MonthlyAcceptanceRateChart";
import { MonthlyTrendCaseChart } from "./chart/MonthlyTrendCaseChart";
import { PreFinancialYearCaseChart } from "./chart/PreFinancialYearCaseChart";
import { TodayCaseBreakdownChart } from "./chart/TodayCaseBreakdownChart";
import { TodayCaseReportChart } from "./chart/TodayCaseReportChart";
import { WeeklyTrendCaseChart } from "./chart/WeeklyTrendCaseChart";
import { DashboardHeader } from "./DashboardHeader";

const CHART_HEIGHT = '450';
const RevivalDashboardPage = () => {
  const { currentFY, previousFY } = getFinancialYears();
  const [filter, setFilter] = useState({ branchCode: '', doCode: '' });

  const { fromMonth, toMonth } = getDateRange(6, "months");
  const { fromMonth: fromWeek, toMonth: toWeek } = getDateRange(7, "weeks");
  const { fromMonth: fromDate, toMonth: toDate } = getDateRange(7, "days");
  const { fromMonth: fromPrevFY, toMonth: toPrevFY } = getDateRange(0, "fy_previous");
  const { fromMonth: fromCurrFY, toMonth: toCurrFY } = getDateRange(0, "fy_current");

  const endpoint = '/sdf';

  const revivalDashboardUrl = ServiceEndpoint.customView.rev.dashboard

  const documentSummaryApi = revivalDashboardUrl.documentSummaryApi

  const documentCardApi = `${documentSummaryApi}?window=headline&fromMonth=${fromMonth}&toMonth=${toMonth}&date=${getDate}`;
  const lastSixMonthTrend = `${documentSummaryApi}?fromMonth=${fromMonth}&toMonth=${toMonth}`;
  const lastSevenWeekTrend = `${documentSummaryApi}?window=weekly&fromWeek=${fromWeek}&toWeek=${toWeek}`;
  const lastSevenDaysTrend = `${documentSummaryApi}?window=daily&fromDate=${fromDate}&toDate=${toDate}`;

  const prevFYMonthTrend = `${documentSummaryApi}?fromMonth=${fromPrevFY}&toMonth=${toPrevFY}`;
  const currFYMonthTrend = `${documentSummaryApi}?fromMonth=${fromCurrFY}&toMonth=${toCurrFY}`;
  const comparativeFYApi = `${documentSummaryApi}?fromMonth=${fromPrevFY}&toMonth=${toCurrFY}`;

  const todayApprovalSummaryApi = `${documentSummaryApi}?window=todayApproval&date=${getDate}`

  return (
    <div className="p-4 bg-slate-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow mb-3 py-1">
        <DashboardHeader setFilter={setFilter} filter={filter} />
      </div>

      <CaseOverviewCard title="Documents Overview (Last 6 Months)" endPoint={documentCardApi}
        filter={filter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <div className="dash-cards">
          <MonthlyTrendCaseChart endPoint={lastSixMonthTrend} filter={filter}
            height={CHART_HEIGHT} subText="Pending . Processed"
            title="Monthly Trend - Last 6 Months" xKey="calMonth"
            yKey={["pendingDocuments", "processedDocuments"]} />
        </div>
        <div className="dash-cards">
          <MonthlyAcceptanceRateChart endPoint={lastSixMonthTrend} filter={filter}
            height={CHART_HEIGHT} subText="Monthly distribution of pending and processed documents"
            title="Document Processing Rate(%) - Last 6 Months" xKey="calMonth"
            yKey={["pendingDocuments", "processedDocuments"]} />
        </div>


        <div className="dash-cards">
          <WeeklyTrendCaseChart endPoint={lastSevenWeekTrend}
            height={CHART_HEIGHT} subText="Pending . Processed"
            title="Weekly Trend - Last 7 Weeks" xKey="calWeek" filter={filter}
            yKey={["pendingDocuments", "processedDocuments"]} />
        </div>

        <div className="dash-cards">
          <DailyTrendCaseChart endPoint={lastSevenDaysTrend}
            height={CHART_HEIGHT} subText="Pending . Processed"
            title="Daily Trend - Last 7 Days" xKey="calDate" filter={filter}
            yKey={["pendingDocuments", "processedDocuments"]} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-3">


        <div className="dash-cards">
          <TodayCaseReportChart endPoint={lastSevenDaysTrend}
            filter={filter} height={CHART_HEIGHT} subText="Document status"
            title="Today's - Approval Summary" xKey="name" yKey="value" />
        </div>

        <div className="dash-cards">
          <TodayCaseBreakdownChart endPoint={todayApprovalSummaryApi}
            filter={filter} height={CHART_HEIGHT} subText="Zone level document status"
            title="Today's - Approval Summary" xKey="zone"
            yKey={["pendingDocuments", "processedDocuments"]} />
        </div>

        <div className="dash-cards">
          <AgingAnalysisChart endPoint={endpoint}
            filter={filter} height={CHART_HEIGHT} subText="Number of pending cases by days"
            title="Ageing Analysis" xKey="name" yKey="value" />
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 mt-3">
        <div className="dash-cards">
          <PreFinancialYearCaseChart endPoint={prevFYMonthTrend}
            height={CHART_HEIGHT} subText="Pending . Processed" filter={filter}
            title={`Previous Financial Year (${previousFY})`} xKey="calMonth"
            yKey={["pendingDocuments", "processedDocuments"]} />
        </div>

        <div className="dash-cards">
          <CurrentFinancialYearCaseChart endPoint={currFYMonthTrend}
            height={CHART_HEIGHT} subText="Pending . Processed" filter={filter}
            title={`Current Financial Year (${currentFY})`} xKey="calMonth"
            yKey={["pendingDocuments", "processedDocuments"]} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-3">
        <div className="dash-cards">
          <FYApprovalComparisonChart endPoint={comparativeFYApi}
            subText="Pending vs Processed — Previous FY vs Current FY"
            filter={filter} height={CHART_HEIGHT} title="Document Summary (Comparative Analysis)"
            xKey="calMonth" yKey={["pendingDocuments", "processedDocuments"]} />
        </div>
      </div>

      {/* <div className="dash-cards">
          <FYPendingComparisonChart endPoint={endpoint} subText="Previous FY vs Current FY"
            filter={filter} height={CHART_HEIGHT} title="Pending Summary (Comparative Analysis)"
            xKey="name" yKey={["preApproved", "currApproved"]} />
        </div> */}

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 mt-3">
        <div className="dash-cards">
          <PendingCasesAging endPoint={'/PendingCaseAging.json'}
            title="Ageing Bucket Distribution" height={CHART_HEIGHT}
            xKey="Xlabel" yKey={["data"]} subText="Number of Pending cases age buckete" />
        </div>
        <div className="dash-cards">
          <AgingDetailsTable />
        </div>
      </div> */}
    </div>
  )
}

export { RevivalDashboardPage };

