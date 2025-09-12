package com.palmyralabs.palmyra.s3.service.impl;

import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ThreadPoolExecutor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.palmyra.filemgmt.spring.FileEmitter;
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
	private static final Logger logger = LoggerFactory.getLogger(AsyncFileServiceImpl.class);
	private ThreadPoolExecutor awsThreadPool;

	public void download(String key, FileEmitter emitter) {
		awsThreadPool.submit(() -> asyncDownload(key, emitter));
	}

	private void asyncDownload(String key, FileEmitter emitter) {
		try {
			GetObjectRequest request = GetObjectRequest.builder().bucket(props.getBucketName()).key(key).build();

			CompletableFuture<ResponsePublisher<GetObjectResponse>> cplResponse = asyncClient.getObject(request,
					AsyncResponseTransformer.toPublisher());

			cplResponse.handleAsync((result, e) -> {
				if (null == e) {
					process(result, emitter);
				} else {
					handle(e, key, emitter);
				}
				return null;
			});

		} catch (Throwable t) {
			logger.error("Error while requesting file " + key, t);
			emitter.completeWithError(t);
		}
	}

	private void handle(Throwable t, String key, FileEmitter emitter) {
		logger.error("Error while downloading file " + key, t);
		emitter.completeWithError(t);
	}

	private void process(ResponsePublisher<GetObjectResponse> publisher, FileEmitter emitter) {
		try {
			GetObjectResponse responseMetadata = publisher.response();

			String contentType = responseMetadata.contentType();
			if (contentType == null || contentType.isEmpty()) {
				contentType = "application/octet-stream";
			}
			emitter.setContentType(contentType);
			publisher.buffer(64 * 1024);
			publisher.subscribe(new S3FileConsumer(awsThreadPool, emitter));
		} catch (Exception e) {
			logger.error("Error while initializing fileEmitter", e);
			emitter.completeWithError(e);
		}
	}

	@Override
	@SneakyThrows
	public void upload(String folder, String originalFilename, MultipartFile file, FileUploadListener listener) {
		AsyncRequestBodyFromInputStreamConfiguration conf = AsyncRequestBodyFromInputStreamConfiguration.builder()
				.inputStream(file.getInputStream()).build();
		String key = Paths.get(folder, originalFilename).toString();
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

	@Autowired
	public void setAwsThreadPool(ThreadPoolExecutor executor) {
		this.awsThreadPool = executor;
	}
}
