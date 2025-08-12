package com.palmyralabs.dms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.service.PolicyFileService;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy")
public class PolicyFileController {

	private final PolicyFileService policyService;

	@GetMapping("/{policyId}/file/{fileId}")
	public ResponseFileEmitter downloadFile(@PathVariable("policyId") Integer policyId,
			@PathVariable("fileId") Integer fileId) {
		return policyService.download(policyId, fileId);
	}

	@PostMapping("/{policyId}/{docketType}/file")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
			@PathVariable("policyId") Integer policyId, @PathVariable("docketType") Integer docketType) {
		String result = policyService.upload(file, policyId, docketType);
		return ResponseEntity.ok(result);
	}

}
