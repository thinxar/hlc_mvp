package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.model.AgingSummaryModel;

import lombok.RequiredArgsConstructor;

// TODO: Postgres migration - original Mongo aggregation preserved at claude/service/dms_revival/_mongo_original/AgingSummaryService.java.txt
@Service
@RequiredArgsConstructor
public class AgingSummaryService {

	public List<AgingSummaryModel> getMonthlyAgingSummary(String doCode, String branchCode,
			LocalDate fromMonth, LocalDate toMonth) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<AgingSummaryModel> getWeeklyAgingSummary(String doCode, String branchCode,
			LocalDate fromWeek, LocalDate toWeek) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<AgingSummaryModel> getDailyAgingSummary(String doCode, String branchCode,
			LocalDate fromDate, LocalDate toDate) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}
}
