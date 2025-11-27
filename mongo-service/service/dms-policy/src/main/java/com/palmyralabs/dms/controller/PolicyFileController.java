package com.palmyralabs.dms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.model.EndorsementSummaryModel;
import com.palmyralabs.dms.model.PolicyFileModel;
import com.palmyralabs.dms.model.PolicyStampModel;
import com.palmyralabs.dms.model.PolicyStampRequest;
import com.palmyralabs.dms.service.EndorsementSummaryService;
import com.palmyralabs.dms.service.PolicyFileService;
import com.palmyralabs.dms.service.PolicyFileStampService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy")
public class PolicyFileController extends AbstractController{
	
	private final PolicyFileService policyFileService;
	private final PolicyFileStampService stampService;
	private final EndorsementSummaryService eSummaryService;

	@GetMapping("/{policyId}/file")
	public PalmyraResponse<List<PolicyFileModel>> getAll(@PathVariable("policyId") Integer policyId) {
		return apiResponse(policyFileService.getAllPolicyFiles(policyId));
	}
	
	@GetMapping("/{policyId}/file/{id}")
	public PalmyraResponse <PolicyFileModel> getById(@PathVariable("policyId") Integer policyId,@PathVariable("id") Integer id) {
		return apiResponse(policyFileService.getById(policyId,id));
	}
	
	@PostMapping("/policyFile/fixedStamp")
	public PalmyraResponse<List<PolicyStampModel>> addStampToPolicyFile(
			@RequestBody PolicyStampRequest policyStampRequest) {
		return apiResponse(stampService.addStamp(policyStampRequest));
	}
	
	@GetMapping("/{policyId}/endorsement/summary")
	public PalmyraResponse<List<EndorsementSummaryModel>> getEndorsementSummary(@PathVariable("policyId") Integer policyId) {
		return apiResponse(eSummaryService.getEndorsementSummary(policyId));
	}
	
	

}
