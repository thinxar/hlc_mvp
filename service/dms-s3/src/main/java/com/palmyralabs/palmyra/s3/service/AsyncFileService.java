package com.palmyralabs.palmyra.s3.service;

import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.filemgmt.stream.FileUploadListener;


public interface AsyncFileService {	

	public void download(String key, ResponseFileEmitter emitter);

	public void upload(String folder, String originalFilename, MultipartFile file, FileUploadListener listener);
	
}
