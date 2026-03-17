package com.palmyralabs.dms.policyBazaar.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	
}
