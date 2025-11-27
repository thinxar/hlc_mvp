package com.palmyralabs.dms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.model.PolicyModel;
import com.palmyralabs.dms.service.PolicyService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}")
public class PolicyController extends AbstractController {

	private final PolicyService policyService;

	@PostMapping("/policy")
	public PalmyraResponse<PolicyModel> createPolicy(@RequestBody PolicyModel request) {
		return apiResponse(policyService.createPolicy(request));
	}

	@GetMapping("/policy")
	public PalmyraResponse<List<PolicyModel>> getAll(@RequestParam(value = "policyNumber", required = false) Long policyNumber) {
		return apiResponse(policyService.getAll(policyNumber));
	}

	@GetMapping("/policy/{id}")
	public PalmyraResponse<PolicyModel> getById(@PathVariable("id") Integer policyId) {
		return apiResponse(policyService.getById(policyId));
	}
}
