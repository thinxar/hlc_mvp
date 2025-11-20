package com.palmyralabs.dms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.model.PolicyStampModel;
import com.palmyralabs.dms.model.PolicyStampRequest;
import com.palmyralabs.dms.service.PolicyFileStampService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy")

public class PolicyFileStampController extends AbstractController {
	private final PolicyFileStampService stampService;

	@PostMapping("/policyFile/fixedStamp")
	public PalmyraResponse<List<PolicyStampModel>> addStampToPolicyFile(
			@RequestBody PolicyStampRequest policyStampRequest) {
		return apiResponse(stampService.addStamp(policyStampRequest));
	}
}
