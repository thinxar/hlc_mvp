package com.palmyralabs.dms.ananda.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.ananda.model.AndPolicyModel;
import com.palmyralabs.dms.ananda.service.AndPolicyService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/and")
public class AndPolicyController extends AbstractController {

	private final AndPolicyService policyService;
	
	@PostMapping("/create/policy")
	public PalmyraResponse<AndPolicyModel> createPolicy(@RequestBody AndPolicyModel request) {
		return apiResponse(policyService.createPolicy(request));
	}
	
}
