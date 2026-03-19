package com.palmyralabs.dms.policyBazaar.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.policyBazaar.model.PbzPolicyFileModel;
import com.palmyralabs.dms.policyBazaar.service.PbzPolicyFileService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/pbv/policy")
public class PbzPolicyFileController extends AbstractController{
    private final PbzPolicyFileService fileService;
    
    @PostMapping("/{policyId}/docketType/{docketTypeId}/file")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
			@PathVariable("policyId") Integer policyId, @PathVariable("docketTypeId") Integer docketTypeId) {
		String result = fileService.upload(file, policyId, docketTypeId, false);
		return ResponseEntity.ok(result);
	}
    
	@GetMapping("/file")
	public PalmyraResponse<List<PbzPolicyFileModel>> getAll(
			@RequestParam(value = "propno", required = false) String proposalNo,
			@RequestParam(value = "officecode", required = false) String boCode,
			@RequestParam(value = "year", required = false) String year) {
		return apiResponse(fileService.getAllPolicyFiles(proposalNo, boCode, year));
	}
}
