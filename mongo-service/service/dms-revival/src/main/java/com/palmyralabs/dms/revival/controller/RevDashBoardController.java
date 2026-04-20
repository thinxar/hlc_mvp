package com.palmyralabs.dms.revival.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.revival.model.ResponseModel;
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

	@GetMapping(path = SUMMARY_PATH)
	public PalmyraResponse<List<ResponseModel>> getMonthlyDocumentSummary(
			@RequestParam(name = "divisionName", required = false) String divisionName,
			@RequestParam(name = "branchName", required = false) String branchName) {
		return apiResponse(dashBoardService.getMonthlyDocumentSummary(divisionName, branchName));
	}

	@GetMapping(path = SUMMARY_PATH, params = "window=weekly")
	public PalmyraResponse<List<ResponseModel>> getWeeklyDocumentSummary(
			@RequestParam(name = "divisionName", required = false) String divisionName,
			@RequestParam(name = "branchName", required = false) String branchName) {
		return apiResponse(dashBoardService.getWeeklyDocumentSummary(divisionName, branchName));
	}

	@GetMapping(path = SUMMARY_PATH, params = "window=daily")
	public PalmyraResponse<List<ResponseModel>> getDailyDocumentSummary(
			@RequestParam(name = "divisionName", required = false) String divisionName,
			@RequestParam(name = "branchName", required = false) String branchName) {
		return apiResponse(dashBoardService.getDailyDocumentSummary(divisionName, branchName));
	}
}
