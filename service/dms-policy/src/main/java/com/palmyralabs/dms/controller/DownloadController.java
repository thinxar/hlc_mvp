package com.palmyralabs.dms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.palmyralabs.dms.service.PolicyFileService;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.s3.service.AsyncFileService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy")
public class DownloadController {

	private final AsyncFileService fileService;
	private final PolicyFileService policyService;

	@GetMapping("/{policyId}/file/{fileId}")
	public ResponseFileEmitter downloadFile(@PathVariable("policyId") Integer policyId,
			@PathVariable("fileId") Integer fileId) {
		ResponseFileEmitter emitter = new ResponseFileEmitter();
		String key = policyService.getKey(policyId,fileId);
		fileService.download(key, emitter);
		return emitter;
	}
}
