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
import com.palmyralabs.dms.model.PolicyStampRequest;
import com.palmyralabs.dms.service.FileService;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy")
public class PolicyFileStampController extends AbstractController {

	private final FileService fileService;

	@GetMapping("/fixedStamp/{stamp}")
	public void getStampForPolicy(HttpServletRequest request, HttpServletResponse response,
			@PathVariable("stamp") String code) throws IOException {
		fileService.download(request, response, code);
	}

	@PostMapping("/{policyId}/docketType/{docketTypeId}/file/fixedStamp")
	public ResponseEntity<String> addStampToPolicyFile(@RequestParam("file") MultipartFile file,
			@PathVariable("policyId") Integer policyId, @PathVariable("docketTypeId") Integer docketTypeId,
			@RequestParam(value = "model") String model) throws IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		PolicyStampRequest policyStampRequest = objectMapper.readValue(model, PolicyStampRequest.class);
		String result = fileService.upload(file, policyId,docketTypeId,policyStampRequest);
		return ResponseEntity.ok(result);
	}

}
