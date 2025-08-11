package com.palmyralabs.dms.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.palmyralabs.dms.model.PolicyFileModel;
import com.palmyralabs.dms.service.PolicyFileService;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy")
public class PolicyFileController {

	private final PolicyFileService policyService;

	@GetMapping("/{policyId}/file/{fileId}")
	public ResponseFileEmitter downloadFile(@PathVariable("policyId") Integer policyId,
			@PathVariable("fileId") Integer fileId) {
		return policyService.download(policyId, fileId);
	}

	@PostMapping("/file")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
			@RequestParam(value = "model") String model) throws IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		PolicyFileModel fileModel = objectMapper.readValue(model, PolicyFileModel.class);
		String result = policyService.upload(file, fileModel);
		return ResponseEntity.ok(result);
	}

}
