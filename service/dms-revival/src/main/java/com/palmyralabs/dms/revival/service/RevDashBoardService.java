package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.revival.model.ApproverSummaryModel;
import com.palmyralabs.dms.revival.model.DailyDocumentSummaryModel;
import com.palmyralabs.dms.revival.model.HeadlineSummaryModel;
import com.palmyralabs.dms.revival.model.MonthlyDocumentSummaryModel;
import com.palmyralabs.dms.revival.model.MonthlyZoneDocumentSummaryModel;
import com.palmyralabs.dms.revival.model.PerApproverSummary;
import com.palmyralabs.dms.revival.model.TodayApprovalSummaryModel;
import com.palmyralabs.dms.revival.model.WeeklyDocumentSummaryModel;

import lombok.RequiredArgsConstructor;

// TODO: Postgres migration - original Mongo aggregation preserved at claude/service/dms_revival/_mongo_original/RevDashBoardService.java.txt
@Service
@RequiredArgsConstructor
public class RevDashBoardService {

	public List<WeeklyDocumentSummaryModel> getWeeklyDocumentSummary(String doCode, String branchCode,
			LocalDate fromWeek, LocalDate toWeek) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<MonthlyDocumentSummaryModel> getMonthlyDocumentSummary(String doCode, String branchCode,
			LocalDate fromMonth, LocalDate toMonth) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<MonthlyZoneDocumentSummaryModel> getMonthlyZoneSummary(String zone, String doCode,
			String branchCode, LocalDate fromDate, LocalDate toDate) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<DailyDocumentSummaryModel> getDailyDocumentSummary(String doCode, String branchCode,
			LocalDate fromDate, LocalDate toDate) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public PaginatedResponse<PerApproverSummary> getApproverBreakdown(String grain,
			LocalDate fromDate, LocalDate toDate, LocalDate date,
			String doCode, String branchCode, String srNumber,
			int limit, int offset, boolean includeTotal) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public ApproverSummaryModel getApproverSummary(String grain,
			LocalDate fromDate, LocalDate toDate, LocalDate date,
			String doCode, String branchCode) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<TodayApprovalSummaryModel> getTodayApprovalSummary(LocalDate date,
			String doCode, String branchCode) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public HeadlineSummaryModel getHeadlineSummary(LocalDate fromMonth, LocalDate toMonth,
			LocalDate date, String doCode, String branchCode) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}
}
