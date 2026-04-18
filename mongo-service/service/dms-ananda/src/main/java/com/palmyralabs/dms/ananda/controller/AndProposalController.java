package com.palmyralabs.dms.ananda.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.ananda.model.AndProposalModel;
import com.palmyralabs.dms.ananda.service.AndProposalService;
import com.palmyralabs.dms.model.PaginatedResponse;
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
	
	@GetMapping("/proposal")
	public PaginatedResponse<AndProposalModel> getAll(@RequestParam(value = "officecode", required = false) String boCode,
			@RequestParam(value = "year", required = false) String year,
			@RequestParam(value = "proposalNo", required = false) String proposalNo,
			@RequestParam(name = "_limit", defaultValue = "15") int limit,
			@RequestParam(name = "_offset", defaultValue = "-1") int offset,
			@RequestParam(name = "_total", defaultValue = "false") boolean includeTotal) {
		return ProposalService.searchPolicies(boCode,year,proposalNo, limit, offset, includeTotal);
	}
	
}
