package com.palmyralabs.dms.neft.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.palmyralabs.dms.neft.service.NeftPolicyFileService;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/neft/policy")
public class PolicyFileDownloadController {

	private final NeftPolicyFileService policyFileService;
	
	@GetMapping("/{policyId}/file/{fileId}/download")
	public ResponseFileEmitter downloadFile(@PathVariable("policyId") Integer policyId,
			@PathVariable("fileId") Integer fileId) {
		return policyFileService.download(policyId, fileId);
	}
}
