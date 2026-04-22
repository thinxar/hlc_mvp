package com.palmyralabs.dms.revival.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.revival.model.BranchPerformanceModel;
import com.palmyralabs.dms.revival.service.DoDashboardService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev")
public class DoDashboardController extends AbstractController {

	private final DoDashboardService doDashboardService;

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
}
