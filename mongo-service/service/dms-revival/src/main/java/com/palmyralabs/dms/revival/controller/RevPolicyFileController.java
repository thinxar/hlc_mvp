package com.palmyralabs.dms.revival.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.model.PolicyFileModel;
import com.palmyralabs.dms.revival.model.PolicyFileActionRequest;
import com.palmyralabs.dms.revival.service.RevPolicyFileService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy/rev")
public class RevPolicyFileController extends AbstractController {

	private final RevPolicyFileService fileService;
	
	@PostMapping("/file/submit")
	public PalmyraResponse<List<PolicyFileModel>> submitDocuments(@RequestBody PolicyFileActionRequest request ) {
		return apiResponse(fileService.updateDocumentStatus(request));
	}

}
