package com.palmyralabs.dms.policyBazaar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.policyBazaar.service.PbzProposalFileService;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/pbv/proposal")
public class PbzProposalFileController extends AbstractController{
    private final PbzProposalFileService fileService;

    @PostMapping("/{proposalId}/docketType/{docketTypeId}/file")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
			@PathVariable("proposalId") Integer proposalId, @PathVariable("docketTypeId") Integer docketTypeId) {
		String result = fileService.upload(file, proposalId, docketTypeId, false);
		return ResponseEntity.ok(result);
	}
}
