package com.palmyralabs.dms.revival.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.revival.model.ApproverSummaryModel;
import com.palmyralabs.dms.revival.model.DailyDocumentSummaryModel;
import com.palmyralabs.dms.revival.model.HeadlineSummaryModel;
import com.palmyralabs.dms.revival.model.MonthlyDocumentSummaryModel;
import com.palmyralabs.dms.revival.model.PerApproverSummary;
import com.palmyralabs.dms.revival.model.TodayApprovalSummaryModel;
import com.palmyralabs.dms.revival.model.WeeklyDocumentSummaryModel;
import com.palmyralabs.dms.revival.service.RevDashBoardService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev")
public class RevDashBoardController extends AbstractController {

	private static final String SUMMARY_PATH = "/overAll/document/summary";

	private final RevDashBoardService dashBoardService;

	@GetMapping(path = SUMMARY_PATH, params = "window=weekly")
	public PalmyraResponse<List<WeeklyDocumentSummaryModel>> getWeeklyDocumentSummary(
			@RequestParam(name = "doCode", required = false) String doCode,
			@RequestParam(name = "branchCode", required = false) String branchCode,
			@RequestParam(name = "fromWeek", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromWeek,
			@RequestParam(name = "toWeek", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toWeek) {
		return apiResponse(dashBoardService.getWeeklyDocumentSummary(doCode, branchCode, fromWeek, toWeek));
	}

	@GetMapping(path = SUMMARY_PATH)
	public PalmyraResponse<List<MonthlyDocumentSummaryModel>> getMonthlyDocumentSummary(
			@RequestParam(name = "doCode", required = false) String doCode,
			@RequestParam(name = "branchCode", required = false) String branchCode,
			@RequestParam(name = "fromMonth", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromMonth,
			@RequestParam(name = "toMonth", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toMonth) {
		return apiResponse(dashBoardService.getMonthlyDocumentSummary(doCode, branchCode, fromMonth, toMonth));
	}

	@GetMapping(path = SUMMARY_PATH, params = "window=daily")
	public PalmyraResponse<List<DailyDocumentSummaryModel>> getDailyDocumentSummary(
			@RequestParam(name = "doCode", required = false) String doCode,
			@RequestParam(name = "branchCode", required = false) String branchCode,
			@RequestParam(name = "fromDate", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@RequestParam(name = "toDate", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
		return apiResponse(dashBoardService.getDailyDocumentSummary(doCode, branchCode, fromDate, toDate));
	}
	
	@GetMapping(path = SUMMARY_PATH, params = "window=todayApproval")
	public PalmyraResponse<List<TodayApprovalSummaryModel>> getTodayApprovalSummary(
			@RequestParam(name = "date", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
			@RequestParam(name = "zone", required = false) String zone,
			@RequestParam(name = "division", required = false) String division,
			@RequestParam(name = "branch", required = false) String branch) {
		return apiResponse(dashBoardService.getTodayApprovalSummary(date, zone, division, branch));
	}
	
	@GetMapping(path = SUMMARY_PATH, params = "window=headline")
	public PalmyraResponse<HeadlineSummaryModel> getHeadlineSummary(
			@RequestParam(name = "fromMonth", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromMonth,
			@RequestParam(name = "toMonth", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toMonth,
			@RequestParam(name = "date", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
			@RequestParam(name = "doCode", required = false) String doCode,
			@RequestParam(name = "branchCode", required = false) String branchCode) {
		return apiResponse(dashBoardService.getHeadlineSummary(
				fromMonth, toMonth, date, doCode, branchCode));
	}

	@GetMapping(path = SUMMARY_PATH, params = "window=approverBreakdown")
	public PaginatedResponse<PerApproverSummary> getApproverBreakdown(
			@RequestParam(name = "grain", required = false) String grain,
			@RequestParam(name = "fromDate", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@RequestParam(name = "toDate", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
			@RequestParam(name = "date", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
			@RequestParam(name = "doCode", required = false) String doCode,
			@RequestParam(name = "branchCode", required = false) String branchCode,
			@RequestParam(name = "srNumber", required = false) String srNumber,
			@RequestParam(name = "_limit", defaultValue = "15") int limit,
			@RequestParam(name = "_offset", defaultValue = "-1") int offset,
			@RequestParam(name = "_total", defaultValue = "false") boolean includeTotal) {
		return dashBoardService.getApproverBreakdown(
				grain, fromDate, toDate, date, doCode, branchCode, srNumber, limit, offset, includeTotal);
	}

	@GetMapping(path = SUMMARY_PATH, params = "window=approverSummary")
	public PalmyraResponse<ApproverSummaryModel> getApproverSummary(
			@RequestParam(name = "grain", required = false) String grain,
			@RequestParam(name = "fromDate", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@RequestParam(name = "toDate", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
			@RequestParam(name = "date", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
			@RequestParam(name = "doCode", required = false) String doCode,
			@RequestParam(name = "branchCode", required = false) String branchCode) {
		return apiResponse(dashBoardService.getApproverSummary(
				grain, fromDate, toDate, date, doCode, branchCode));
	}

}
