package com.palmyralabs.dms.ananda.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.ananda.model.AndProposalFileModel;
import com.palmyralabs.dms.ananda.service.AndProposalFileService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/and/proposal")
public class AndProposalFileController extends AbstractController{
    private final AndProposalFileService fileService;
    
    @PostMapping("/{proposalId}/docketType/{docketTypeId}/file")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
			@PathVariable("proposalId") Integer proposalId, @PathVariable("docketTypeId") Integer docketTypeId) {
		String result = fileService.upload(file, proposalId, docketTypeId, false);
		return ResponseEntity.ok(result);
	}
    
	@GetMapping("/file")
	public PalmyraResponse<List<AndProposalFileModel>> getAll(
			@RequestParam(value = "propno", required = false) String proposalNo,
			@RequestParam(value = "officecode", required = false) String boCode,
			@RequestParam(value = "year", required = false) String year) {
		return apiResponse(fileService.getAllProposalFiles(proposalNo, boCode, year));
	}
}
