package com.palmyralabs.dms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.s3.service.AsyncFileService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy/{policy_id}/file/{key}")
public class DownloadController {
	private final AsyncFileService fileService;
	
	@GetMapping
	public ResponseFileEmitter downloadFile(@PathVariable(name = "key") String key) {
		ResponseFileEmitter emitter = new ResponseFileEmitter();
		fileService.download("NOC.pdf", emitter);
		return emitter;
	}
}
