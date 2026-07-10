package com.palmyralabs.dms.neft.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.neft.model.NeftPolicyFileModel;
import com.palmyralabs.dms.neft.service.NeftPolicyFileService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/neft/policy")
public class NeftPolicyFileController extends AbstractController {

	private final NeftPolicyFileService policyFileService;

	@GetMapping("/{policyId}/file")
	public PalmyraResponse<List<NeftPolicyFileModel>> getAll(@PathVariable("policyId") Integer policyId) {
		return apiResponse(policyFileService.getAllPolicyFiles(policyId));
	}

	@GetMapping("/{policyId}/file/{id}")
	public PalmyraResponse<NeftPolicyFileModel> getById(@PathVariable("policyId") Integer policyId,
			@PathVariable("id") Integer id) {
		return apiResponse(policyFileService.getById(policyId, id));
	}

	@PostMapping("/{policyId}/docketType/{docketTypeId}/file")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
			@PathVariable("policyId") Integer policyId, @PathVariable("docketTypeId") Integer docketTypeId) {
		String result = policyFileService.upload(file, policyId, docketTypeId, false);
		return ResponseEntity.ok(result);
	}

}
