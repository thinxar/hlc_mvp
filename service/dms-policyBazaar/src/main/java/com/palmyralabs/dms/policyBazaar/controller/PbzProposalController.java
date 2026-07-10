package com.palmyralabs.dms.policyBazaar.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.policyBazaar.model.PbzProposalModel;
import com.palmyralabs.dms.policyBazaar.service.PbzProposalService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/pbv")
public class PbzProposalController extends AbstractController {

	private final PbzProposalService policyService;

	@PostMapping("/create/proposal")
	public PalmyraResponse<PbzProposalModel> createPolicy(@RequestBody PbzProposalModel request) {
		return apiResponse(policyService.createPolicy(request));
	}

}
