package com.palmyralabs.dms.policyBazaar.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.policyBazaar.model.PbzPolicyModel;
import com.palmyralabs.dms.policyBazaar.service.PbzPolicyService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/pbv")
public class PbzPolicyController extends AbstractController {

	private final PbzPolicyService policyService;
	
	@PostMapping("/create/policy")
	public PalmyraResponse<PbzPolicyModel> createPolicy(@RequestBody PbzPolicyModel request) {
		return apiResponse(policyService.createPolicy(request));
	}
	
	@GetMapping("/policy")
	public PaginatedResponse<PbzPolicyModel> getAll(@RequestParam(value = "officecode", required = false) String boCode,
			@RequestParam(value = "year", required = false) String year,
			@RequestParam(value = "proposalNo", required = false) String proposalNo,
			@RequestParam(name = "_limit", defaultValue = "15") int limit,
			@RequestParam(name = "_offset", defaultValue = "-1") int offset,
			@RequestParam(name = "_total", defaultValue = "false") boolean includeTotal) {
		return policyService.searchPolicies(boCode,year,proposalNo, limit, offset, includeTotal);
	}
	
}
