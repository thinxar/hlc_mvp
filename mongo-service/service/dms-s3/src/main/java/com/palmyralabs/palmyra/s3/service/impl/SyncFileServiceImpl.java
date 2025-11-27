package com.palmyralabs.palmyra.s3.service.impl;

import java.io.IOException;
import java.nio.file.Path;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.filemgmt.stream.FileUploadListener;
import com.palmyralabs.palmyra.s3.spring.S3Config;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class SyncFileServiceImpl {

	private final S3Client client;
	private final S3Config props;
	private static final Logger logger = LoggerFactory.getLogger(SyncFileServiceImpl.class);

	public void download(String key, ResponseFileEmitter emitter) {

		try {
			GetObjectRequest request = GetObjectRequest.builder().bucket(props.getBucketName()).key(key).build();
			ResponseInputStream<GetObjectResponse> response = client.getObject(request);

			byte[] buffer = new byte[16 * 1024];
			int length = 0;

			try {
				while ((length = response.read(buffer)) > 0) {
					emitter.send(buffer, length);
				}
				emitter.complete();
			} catch (IOException e) {
				logger.info("Exception while processing the buffer", e);
				emitter.completeWithError(e);
			} finally {
				try {
					response.close();
				} catch (IOException e) {
					logger.info("Exception while closing the response", e);
				}
			}
		} catch (Exception e) {
			logger.info("Exception while processing the download", e);
			emitter.completeWithError(e);
		}

	}

	public void upload(String key, Path path, FileUploadListener listener) {
		PutObjectRequest request = PutObjectRequest.builder().bucket(props.getBucketName()).key(key).build();
		RequestBody requestBody = RequestBody.fromFile(path);
		try {
			PutObjectResponse response = client.putObject(request, requestBody);
			processResponse(key, response, listener);
		} catch (Exception e) {
			logger.info("Exception while uploading the file", e);
			listener.onFailure(e);
		}
	}

	private void processResponse(String key, PutObjectResponse response, FileUploadListener listener) {
		listener.onSuccess(key);
	}

	@SneakyThrows
	public void upload(String folder, String originalFilename, MultipartFile file, FileUploadListener listener) {
		String key = String.join("/",folder,originalFilename);
		PutObjectRequest request = PutObjectRequest.builder().bucket(props.getBucketName())
				.contentType(file.getContentType()).key(key).build();

		RequestBody requestBody = RequestBody.fromInputStream(file.getInputStream(), file.getSize());
		try {
			PutObjectResponse response = client.putObject(request, requestBody);
			
			HeadObjectRequest headRequest = HeadObjectRequest.builder().bucket(props.getBucketName()).key(key).build();
			HeadObjectResponse headResponse = client.headObject(headRequest);
			long uploadedFileSize = headResponse.contentLength();
			if (uploadedFileSize == 0) {
		            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
		                    .bucket(props.getBucketName())
		                    .key(key)
		                    .build();

		            client.deleteObject(deleteRequest);
		            throw new IllegalStateException("Uploaded file is 0 KB and has been deleted.");
		        }
			processResponse(key, response, listener);
		} catch (Exception e) {
			listener.onFailure(e);
			throw e;
		}
	}
}
