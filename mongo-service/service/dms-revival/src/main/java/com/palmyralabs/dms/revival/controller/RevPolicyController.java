package com.palmyralabs.dms.revival.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.model.PolicyModel;
import com.palmyralabs.dms.revival.service.RevPolicyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev")
public class RevPolicyController {

	private final RevPolicyService policyService;

	@GetMapping("/policy")
	public PaginatedResponse<PolicyModel> getAll(@RequestParam(value = "officeCode", required = false) String soCode,
			@RequestParam(value = "srNo", required = false) String srNo,
			@RequestParam(value = "policyNumber", required = false) String policyNumber,
			@RequestParam(name = "_limit", defaultValue = "15") int limit,
			@RequestParam(name = "_offset", defaultValue = "-1") int offset,
			@RequestParam(name = "_total", defaultValue = "false") boolean includeTotal) {

		return policyService.searchPolicies(soCode,srNo,policyNumber, limit, offset, includeTotal);
	}
}
