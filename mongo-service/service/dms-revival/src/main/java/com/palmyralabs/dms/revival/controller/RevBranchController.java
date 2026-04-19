package com.palmyralabs.dms.revival.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.revival.model.BranchModel;
import com.palmyralabs.dms.revival.model.DivisionModel;
import com.palmyralabs.dms.revival.service.BranchService;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev")
public class RevBranchController extends AbstractController {

	private final BranchService branchService;

	@GetMapping("/branch")
	public PaginatedResponse<BranchModel> getBranches(
			@RequestParam(name = "_limit", defaultValue = "15") int limit,
			@RequestParam(name = "_offset", defaultValue = "-1") int offset,
			@RequestParam(name = "_total", defaultValue = "false") boolean includeTotal,
			@RequestParam(name = "divisionName", required = false) String divisionName,
			@RequestParam(name = "branchName", required = false) String branchName) {
		return branchService.getBranchesByDivision(limit,offset,includeTotal,divisionName,branchName);
	}

	@GetMapping("/division")
	public PaginatedResponse<DivisionModel> getDivisionByBranch(@RequestParam(name = "_limit", defaultValue = "15") int limit,
			@RequestParam(name = "_offset", defaultValue = "-1") int offset,
			@RequestParam(name = "_total", defaultValue = "false") boolean includeTotal,
			@RequestParam(name = "divisionName", required = false) String divisionName,
			@RequestParam(name = "branchName", required = false) String branchName) {
		return branchService.getDivisionByBranch(limit,offset,includeTotal,branchName,divisionName);
	}
}
