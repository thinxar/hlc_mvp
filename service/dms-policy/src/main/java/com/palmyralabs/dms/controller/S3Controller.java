package com.palmyralabs.dms.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.service.S3Service;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "public/file")
public class S3Controller {
	
	private final S3Service s3Service;

	@PostMapping("/upload")
	public String uploadFile(@RequestParam(value = "file", required = true) MultipartFile file) {
		s3Service.uploadFile(file, file.getOriginalFilename());
		return "Success";
	}
	
	@GetMapping("/download")
	public ResponseEntity<byte[]> downloadFile(@RequestParam("key") String key) {
	    byte[] data = s3Service.downloadFile(key);
	    return ResponseEntity.ok()
	            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + key + "\"")
	            .body(data);
	}
}
