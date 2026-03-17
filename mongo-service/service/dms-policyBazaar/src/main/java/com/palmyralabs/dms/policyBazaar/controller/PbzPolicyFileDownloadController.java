package com.palmyralabs.dms.policyBazaar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.palmyralabs.dms.policyBazaar.service.PbzPolicyFileService;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/pbv/policy")
public class PbzPolicyFileDownloadController {
	
	private final PbzPolicyFileService fileService;
	
	@GetMapping("/{policyId}/file/{fileId}/download")
	public ResponseFileEmitter downloadFile(@PathVariable("policyId") Integer policyId,
			@PathVariable("fileId") Integer fileId) {
		return fileService.download(policyId, fileId);
	}

}
