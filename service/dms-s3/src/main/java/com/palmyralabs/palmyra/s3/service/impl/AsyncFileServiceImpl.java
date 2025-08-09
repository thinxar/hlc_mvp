package com.palmyralabs.palmyra.s3.service.impl;

import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.filemgmt.stream.FileUploadListener;
import com.palmyralabs.palmyra.s3.service.AsyncFileService;
import com.palmyralabs.palmyra.s3.spring.S3Config;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.core.async.AsyncRequestBodyFromInputStreamConfiguration;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.core.async.ResponsePublisher;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncFileServiceImpl implements AsyncFileService {

	private final S3AsyncClient asyncClient;

	private final S3Config props;

	public void download(String key, ResponseFileEmitter emitter) {
		asyncDownload(key, emitter);
	}

	private void asyncDownload(String key, ResponseFileEmitter emitter) {
		try {
			GetObjectRequest request = GetObjectRequest.builder().bucket(props.getBucketName()).key(key).build();

			CompletableFuture<ResponsePublisher<GetObjectResponse>> cplResponse = asyncClient.getObject(request,
					AsyncResponseTransformer.toPublisher());

			ResponsePublisher<GetObjectResponse> publisher = cplResponse.join();

			GetObjectResponse responseMetadata = publisher.response();

			String contentType = responseMetadata.contentType();
			if (contentType == null || contentType.isEmpty()) {
				contentType = "application/octet-stream";
			}
			emitter.setContentType(contentType);
			publisher.subscribe(new S3FileConsumer(emitter));
		} catch (Exception t) {
			log.error("Error while downloading file " + key, t);
			emitter.completeWithError(t);
		}
	}

	@Override
	@SneakyThrows
	public void upload(String folder, String originalFilename, MultipartFile file, FileUploadListener listener) {
		AsyncRequestBodyFromInputStreamConfiguration conf = AsyncRequestBodyFromInputStreamConfiguration
				.builder().inputStream(file.getInputStream()).build();
		String key = Paths.get(folder,  originalFilename).toString();
		PutObjectRequest request = PutObjectRequest.builder().bucket(props.getBucketName()).key(key).build();
		AsyncRequestBody requestBody = AsyncRequestBody.fromInputStream(conf);
		CompletableFuture<PutObjectResponse> cl = asyncClient.putObject(request, requestBody);
		cl.handleAsync((response, ex) -> {
			if (ex != null) {
				listener.onFailure(ex);
				return null;
			} else {
				listener.onSuccess(folder);
				return response;
			}
		});		
	}

//	@Override
//	public void upload(String key, Path path, FileUploadListener listener) {
//		PutObjectRequest request = PutObjectRequest.builder().bucket(props.getBucketName()).key(key).build();
//		AsyncRequestBody requestBody = AsyncRequestBody.fromFile(path);
//		CompletableFuture<PutObjectResponse> cl = asyncClient.putObject(request, requestBody);
//		cl.handleAsync((response, ex) -> {
//			if (ex != null) {
//				listener.onFailure(ex);
//				return null;
//			} else {
//				listener.onSuccess(key);
//				return response;
//			}
//		});
//	}
}
