package com.palmyralabs.dms.revival.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
