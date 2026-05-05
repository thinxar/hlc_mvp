package com.palmyralabs.dms.neft.controller;


import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.neft.model.NeftPolicyModel;
import com.palmyralabs.dms.neft.service.NeftPolicyService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/neft")
public class NeftPolicyController extends AbstractController {

	private final NeftPolicyService policyService;
	
	@PostMapping("/policy")
	public PalmyraResponse<NeftPolicyModel> createPolicy(@RequestBody NeftPolicyModel request) {
		return apiResponse(policyService.createPolicy(request));
	}

	@GetMapping("/policy")
	public PalmyraResponse<List<NeftPolicyModel>> getAll(@RequestParam(value = "policyNumber", required = false) Long policyNumber) {
		return apiResponse(policyService.getAll(policyNumber));
	}

	@GetMapping("/policy/{id}")
	public PalmyraResponse<NeftPolicyModel> getById(@PathVariable("id") Integer policyId) {
		return apiResponse(policyService.getById(policyId));
	}
}
