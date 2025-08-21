package com.palmyralabs.palmyra.s3.service.impl;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

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
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class SyncFileServiceImpl {

	private final S3Client client;

	private final S3Config props;

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
				emitter.completeWithError(e); // Handle errors
			} finally {
				try {
					response.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		} catch (Exception e) {
			emitter.completeWithError(e);
			e.printStackTrace();
		}

	}

	public void upload(String key, Path path, FileUploadListener listener) {
		PutObjectRequest request = PutObjectRequest.builder().bucket(props.getBucketName()).key(key).build();
		RequestBody requestBody = RequestBody.fromFile(path);
		try {
			PutObjectResponse response = client.putObject(request, requestBody);
			processResponse(key, response, listener);
		} catch (Exception e) {
			listener.onFailure(e);
		}
	}

	private void processResponse(String key, PutObjectResponse response, FileUploadListener listener) {
		listener.onSuccess(key);
	}

	@SneakyThrows
	public void upload(String folder, String originalFilename, MultipartFile file, FileUploadListener listener) {
		String key = Paths.get(folder,  originalFilename).toString();
		PutObjectRequest request = PutObjectRequest.builder().bucket(props.getBucketName())
		.contentType(file.getContentType())
		.key(key).build();
		RequestBody requestBody = RequestBody.fromInputStream(file.getInputStream(), file.getSize());
		try {
			PutObjectResponse response = client.putObject(request, requestBody);
			processResponse(key, response, listener);
		} catch (Exception e) {
			listener.onFailure(e);
			log.error("S3 upload failed for file '{}': {}", originalFilename, e.getMessage());
			throw new RuntimeException("upload failed");
		}		
	}
}
