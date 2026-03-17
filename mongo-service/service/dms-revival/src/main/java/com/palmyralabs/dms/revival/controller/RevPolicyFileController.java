package com.palmyralabs.dms.revival.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.revival.model.PolicyFileActionRequest;
import com.palmyralabs.dms.revival.model.RevPolicyFileModel;
import com.palmyralabs.dms.revival.service.RevPolicyFileService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev/policy")
public class RevPolicyFileController extends AbstractController {

	private final RevPolicyFileService fileService;
	
	@PostMapping("/{policyId}/docketType/{docketTypeId}/file")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
			@PathVariable("policyId") Integer policyId, @PathVariable("docketTypeId") Integer docketTypeId) {
		String result = fileService.upload(file, policyId, docketTypeId, false);
		return ResponseEntity.ok(result);
	}

	@GetMapping("/file")
	public PalmyraResponse<List<RevPolicyFileModel>> getAll(
			@RequestParam(value = "policyno", required = false) String policyNumber,
			@RequestParam(value = "officecode", required = false) String soCode,
			@RequestParam(value = "srno", required = false) String srNo,
			@RequestParam(value = "asrno", required = false) String asrNo) {
		return apiResponse(fileService.getAllPolicyFiles(policyNumber, soCode, srNo, asrNo));
	}

	@PostMapping("/file/submit")
	public PalmyraResponse<List<RevPolicyFileModel>> submitDocuments(@RequestBody PolicyFileActionRequest request) {
		return apiResponse(fileService.updateDocumentStatus(request));
	}
	

}
