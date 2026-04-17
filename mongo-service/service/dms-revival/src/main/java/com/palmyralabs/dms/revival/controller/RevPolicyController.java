package com.palmyralabs.dms.revival.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.revival.model.RevPolicyModel;
import com.palmyralabs.dms.revival.service.RevPolicyService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev")
public class RevPolicyController extends AbstractController {

	private final RevPolicyService policyService;
	
	@PostMapping("/create/policy")
	public PalmyraResponse<RevPolicyModel> createPolicy(@RequestBody RevPolicyModel request) {
		return apiResponse(policyService.createPolicy(request));
	}
	
	@GetMapping("/policy")
	public PaginatedResponse<RevPolicyModel> getAll(@RequestParam(value = "officecode", required = false) String soCode,
			@RequestParam(value = "srno", required = false) String srNo,
			@RequestParam(value = "policyNumber", required = false) String policyNumber,
			@RequestParam(name = "_limit", defaultValue = "15") int limit,
			@RequestParam(name = "_offset", defaultValue = "-1") int offset,
			@RequestParam(name = "_total", defaultValue = "false") boolean includeTotal,
			@RequestParam(value = "dos", required = false) String dos,
			@RequestParam(name = "_orderBy", required = false, defaultValue = "") String orderBy) {
		return policyService.searchPolicies(soCode,srNo,policyNumber, limit, offset, includeTotal,dos,orderBy);
	}
}
