package com.palmyralabs.dms.revival.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.revival.model.AgingSummaryModel;
import com.palmyralabs.dms.revival.service.AgingSummaryService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev")
public class AgingSummaryController extends AbstractController {

	private static final String PATH = "/overAll/agingSummary";

	private final AgingSummaryService agingSummaryService;

	@GetMapping(path = PATH)
	public PalmyraResponse<List<AgingSummaryModel>> getMonthlyAgingSummary(
			@RequestParam(name = "doCode", required = false) String doCode,
			@RequestParam(name = "branchCode", required = false) String branchCode,
			@RequestParam(name = "fromMonth", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromMonth,
			@RequestParam(name = "toMonth", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toMonth) {
		return apiResponse(agingSummaryService.getMonthlyAgingSummary(doCode, branchCode, fromMonth, toMonth));
	}

	@GetMapping(path = PATH, params = "window=weekly")
	public PalmyraResponse<List<AgingSummaryModel>> getWeeklyAgingSummary(
			@RequestParam(name = "doCode", required = false) String doCode,
			@RequestParam(name = "branchCode", required = false) String branchCode,
			@RequestParam(name = "fromWeek", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromWeek,
			@RequestParam(name = "toWeek", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toWeek) {
		return apiResponse(agingSummaryService.getWeeklyAgingSummary(doCode, branchCode, fromWeek, toWeek));
	}

	@GetMapping(path = PATH, params = "window=daily")
	public PalmyraResponse<List<AgingSummaryModel>> getDailyAgingSummary(
			@RequestParam(name = "doCode", required = false) String doCode,
			@RequestParam(name = "branchCode", required = false) String branchCode,
			@RequestParam(name = "fromDate", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@RequestParam(name = "toDate", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
		return apiResponse(agingSummaryService.getDailyAgingSummary(doCode, branchCode, fromDate, toDate));
	}
}
