package com.palmyralabs.dms.ananda.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.palmyralabs.dms.ananda.service.AndPolicyFileService;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/and/policy")
public class AndPolicyFileDownloadController {
	private final AndPolicyFileService fileService;


	@GetMapping("/{policyId}/file/{fileId}/download")
	public ResponseFileEmitter downloadFile(@PathVariable("policyId") Integer policyId,
			@PathVariable("fileId") Integer fileId) {
		return fileService.download(policyId, fileId);
	}
}
