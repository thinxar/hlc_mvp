package com.palmyralabs.palmyra.s3.controller;

import java.io.FileNotFoundException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.palmyra.s3.service.AsyncFileService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}")
public class S3Controller {
	private final AsyncFileService asyncFileService;

	@GetMapping("/download")
	public void get(@RequestParam String key, HttpServletResponse response) throws FileNotFoundException {
		asyncFileService.downloadFile(key, response);
	}
}
