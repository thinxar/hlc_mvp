package com.palmyralabs.dms.ananda.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.ananda.model.AndProposalModel;
import com.palmyralabs.dms.ananda.service.AndProposalService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/and")
public class AndProposalController extends AbstractController {

	private final AndProposalService ProposalService;

	@PostMapping("/create/proposal")
	public PalmyraResponse<AndProposalModel> createProposal(@RequestBody AndProposalModel request) {
		return apiResponse(ProposalService.createProposal(request));
	}

}
