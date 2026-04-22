package com.palmyralabs.dms.revival.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.revival.model.BranchPerformanceModel;
import com.palmyralabs.dms.revival.model.DivisionPerformanceModel;
import com.palmyralabs.dms.revival.model.DoAgingBucketModel;
import com.palmyralabs.dms.revival.service.DoDashboardService;
import com.palmyralabs.dms.revival.service.DoSummaryService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev")
public class DoDashboardController extends AbstractController {

	private final DoDashboardService doDashboardService;
	private final DoSummaryService doSummaryService;

	@GetMapping(path = "/do/branch/processed")
	public PalmyraResponse<List<BranchPerformanceModel>> getBranchProcessed(
			@RequestParam(name = "doCode") String doCode,
			@RequestParam(name = "order", defaultValue = "top") String order,
			@RequestParam(name = "count", defaultValue = "10") int count,
			@RequestParam(name = "window", defaultValue = "1") int window) {
		return apiResponse(doDashboardService.getBranchProcessed(doCode, order, count, window));
	}

	@GetMapping(path = "/do/branch/pending")
	public PalmyraResponse<List<BranchPerformanceModel>> getBranchPending(
			@RequestParam(name = "doCode") String doCode,
			@RequestParam(name = "order", defaultValue = "top") String order,
			@RequestParam(name = "count", defaultValue = "10") int count,
			@RequestParam(name = "window", defaultValue = "1") int window) {
		return apiResponse(doDashboardService.getBranchPending(doCode, order, count, window));
	}

	@GetMapping(path = "/do/branch/submitted")
	public PalmyraResponse<List<BranchPerformanceModel>> getBranchSubmitted(
			@RequestParam(name = "doCode") String doCode,
			@RequestParam(name = "order", defaultValue = "top") String order,
			@RequestParam(name = "count", defaultValue = "10") int count,
			@RequestParam(name = "window", defaultValue = "1") int window) {
		return apiResponse(doDashboardService.getBranchSubmitted(doCode, order, count, window));
	}

	@GetMapping(path = "/do/branch/pending/ratio")
	public PalmyraResponse<List<BranchPerformanceModel>> getBranchPendingRatio(
			@RequestParam(name = "doCode") String doCode,
			@RequestParam(name = "order", defaultValue = "top") String order,
			@RequestParam(name = "count", defaultValue = "10") int count,
			@RequestParam(name = "window", defaultValue = "1") int window) {
		return apiResponse(doDashboardService.getBranchPendingRatio(doCode, order, count, window));
	}

	@GetMapping(path = "/do/branch/processed/ratio")
	public PalmyraResponse<List<BranchPerformanceModel>> getBranchProcessedRatio(
			@RequestParam(name = "doCode") String doCode,
			@RequestParam(name = "order", defaultValue = "top") String order,
			@RequestParam(name = "count", defaultValue = "10") int count,
			@RequestParam(name = "window", defaultValue = "1") int window) {
		return apiResponse(doDashboardService.getBranchProcessedRatio(doCode, order, count, window));
	}

	@GetMapping(path = "/do/branches")
	public PalmyraResponse<List<BranchPerformanceModel>> listBranches(
			@RequestParam(name = "doCode") String doCode,
			@RequestParam(name = "limit", defaultValue = "15") int limit,
			@RequestParam(name = "orderBy", defaultValue = "branchName") String orderBy,
			@RequestParam(name = "window", defaultValue = "1") int window) {
		return apiResponse(doDashboardService.listBranches(doCode, limit, orderBy, window));
	}

	@GetMapping(path = "/do/division/performance")
	public PalmyraResponse<List<DivisionPerformanceModel>> listDivisionPerformance(
			@RequestParam(name = "doCode") String doCode,
			@RequestParam(name = "window", defaultValue = "1") int window) {
		return apiResponse(doSummaryService.listDivisionPerformance(doCode, window));
	}

	@GetMapping(path = "/do/aging")
	public PalmyraResponse<DoAgingBucketModel> getAgingBuckets(
			@RequestParam(name = "doCode") String doCode,
			@RequestParam(name = "window", defaultValue = "1") int window) {
		return apiResponse(doSummaryService.getAgingBuckets(doCode, window));
	}
}
