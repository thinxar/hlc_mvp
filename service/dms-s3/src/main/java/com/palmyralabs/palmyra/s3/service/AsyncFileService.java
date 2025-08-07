package com.palmyralabs.palmyra.s3.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.palmyralabs.palmyra.base.exception.ResourceNotFoundException;
import com.palmyralabs.palmyra.s3.model.S3Properties;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncFileService {
	
	private final S3Properties props;
	private final AmazonS3 amazonS3;

	public CompletableFuture<String> uploadFileAsync(MultipartFile multipartFile, String key) {
	    return CompletableFuture.supplyAsync(() -> {
	        try {
	            if (props.getEndpoint() == null || props.getRegion() == null) {
	                throw new ResourceNotFoundException("INV001", "S3 endpoint or region not configured properly");
	            }

	            if (multipartFile.getContentType() != null && multipartFile.getContentType().contains("xml")) {
	                throw new ResourceNotFoundException("INV001", "XML files are not supported.");
	            }

	            if (!amazonS3.doesBucketExistV2(props.getBucketName())) {
	                throw new ResourceNotFoundException("INV001", "Invalid BucketName.");
	            }

	            // Read and upload file to S3
	            byte[] fileBytes = multipartFile.getBytes();
	            ByteArrayInputStream inputStream = new ByteArrayInputStream(fileBytes);

	            ObjectMetadata metadata = new ObjectMetadata();
	            metadata.setContentLength(fileBytes.length);
	            metadata.setContentType(multipartFile.getContentType());

	            amazonS3.putObject(props.getBucketName(), key, inputStream, metadata);

	            return "Uploaded successfully with key: " + key;

	        } catch (IOException e) {
	            throw new CompletionException(new ResourceNotFoundException("INV003", "Failed to upload file"));
	        }
	    });
	}

	@Async
	public void downloadFile(String key, HttpServletResponse response) {
	    try {
	        if (props.getEndpoint() == null || props.getRegion() == null) {
	            throw new ResourceNotFoundException("S3INV001", "S3 endpoint or region not configured properly");
	        }

	        if (!amazonS3.doesObjectExist(props.getBucketName(), key)) {
	            throw new ResourceNotFoundException("INV001", "File with key '" + key + "' does not exist in the bucket.");
	        }

	        S3Object s3Object = amazonS3.getObject(props.getBucketName(), key);
	        S3ObjectInputStream inputStream = s3Object.getObjectContent();

	        response.setContentType(s3Object.getObjectMetadata().getContentType());
	        response.setHeader("Content-Disposition", "attachment; filename=\"" + key + "\"");
	        response.setContentLengthLong(s3Object.getObjectMetadata().getContentLength());

	        IOUtils.copy(inputStream, response.getOutputStream());

	        response.flushBuffer();
	        inputStream.close();
	    } catch (IOException e) {
	        throw new RuntimeException("Failed to download file", e);
	    }
	}
}
