package com.palmyralabs.dms.ananda.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.palmyralabs.dms.ananda.service.AndProposalFileService;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/and/proposal")
public class AndProposalFileDownloadController {
	private final AndProposalFileService fileService;


	@GetMapping("/{proposalId}/file/{fileId}/download")
	public ResponseFileEmitter downloadFile(@PathVariable("proposalId") Integer proposalId,
			@PathVariable("fileId") Integer fileId) {
		return fileService.download(proposalId, fileId);
	}
}
