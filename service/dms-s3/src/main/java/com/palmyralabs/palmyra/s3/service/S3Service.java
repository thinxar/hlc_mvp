package com.palmyralabs.palmyra.s3.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.palmyralabs.palmyra.base.exception.ResourceNotFoundException;
import com.palmyralabs.palmyra.s3.model.S3Properties;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class S3Service {

	private final AmazonS3 amazonS3;
	private final S3Properties props;
//	private final AsyncFileService asyncFileService;

	public String uploadFile(MultipartFile multipartFile, String key) {
		try {
			if (props.getEndpoint() == null || props.getRegion() == null) {
				throw new ResourceNotFoundException("INV001", "S3 endpoint or region not configured properly");
			}

			if (multipartFile.getContentType() != null && multipartFile.getContentType().contains("xml")) {
				throw new ResourceNotFoundException("INV001", "XML files are not supported.");
			}

			if (!amazonS3.doesBucketExistV2(props.getBucketName())) {
				throw new ResourceNotFoundException("INV001", "Invalid BucketName.");
				// amazonS3.createBucket(props.getBucketName());
			}
//			CompletableFuture<String> futureResult = asyncFileService.processFileAsync(multipartFile);
//
//			// Check if the task is done
//			if (futureResult.isDone()) {
//			    try {
//			        String result = futureResult.get(); // Get the result (blocks if not done)
//			        System.out.println("File processed successfully: " + result);
//			    } catch (InterruptedException | ExecutionException e) {
//			        System.err.println("Error processing file: " + e.getMessage());
//			    }
//			} else {
//			    System.out.println("File processing is still ongoing...");
//			}

			// Upload file
			byte[] fileBytes = multipartFile.getBytes();
			ByteArrayInputStream inputStream = new ByteArrayInputStream(fileBytes);

			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentLength(fileBytes.length);
			metadata.setContentType(multipartFile.getContentType());

			amazonS3.putObject(props.getBucketName(), key, inputStream, metadata);

			return "Uploaded successfully with key: " + key;
		} catch (IOException e) {
			throw new ResourceNotFoundException("INV003", "Failed to upload file");
		}
	}

	@Async
	public byte[] downloadFile(String key) {
		try {
			if (props.getEndpoint() == null || props.getRegion() == null) {
				throw new ResourceNotFoundException("S3INV001", "S3 endpoint or region not configured properly");
			}

			if (!amazonS3.doesObjectExist(props.getBucketName(), key)) {
				throw new ResourceNotFoundException("INV001", "File with key '" + key + "' does not exist in the bucket.");
			}

			S3Object s3Object = amazonS3.getObject(props.getBucketName(), key);
			S3ObjectInputStream inputStream = s3Object.getObjectContent();

			byte[] content = inputStream.readAllBytes();

			
			inputStream.close();
			return content;
		} catch (IOException e) {
			throw new RuntimeException("Failed to download file", e);
		}
	}
	
	

	
//	@Async
//    public void downloadFileAsync(String key, String downloadId, Path localPath) {
//        trackerService.startTracking(downloadId);
//
//        try {
//            if (props.getEndpoint() == null || props.getRegion() == null) {
//                throw new ResourceNotFoundException("S3INV001", "S3 endpoint or region not configured properly");
//            }
//
//            if (!amazonS3.doesObjectExist(props.getBucketName(), key)) {
//                throw new ResourceNotFoundException("INV001", "File with key '" + key + "' does not exist in the bucket.");
//            }
//
//            S3Object s3Object = amazonS3.getObject(props.getBucketName(), key);
//            try (S3ObjectInputStream inputStream = s3Object.getObjectContent()) {
//                Files.copy(inputStream, localPath, StandardCopyOption.REPLACE_EXISTING);
//            }
//
//            trackerService.markCompleted(downloadId);
//
//        } catch (Exception e) {
//            trackerService.markFailed(downloadId);
//        }
//    }

}
