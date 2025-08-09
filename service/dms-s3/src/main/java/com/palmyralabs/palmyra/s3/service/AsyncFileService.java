package com.palmyralabs.palmyra.s3.service;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.concurrent.CompletableFuture;

import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;
import org.springframework.stereotype.Service;

import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.s3.spring.S3Config;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.core.async.ResponsePublisher;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncFileService {

	private final S3AsyncClient asyncClient;
	private final S3Client client;

	private final S3Config props;

	public void download(String key, ResponseFileEmitter emitter) {
		asyncDownload(key, emitter);
	}

	public void syncDownload(String key, ResponseFileEmitter emitter) {
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

	@RequiredArgsConstructor
	private static final class S3FileConsumer implements Subscriber<ByteBuffer> {

		private final ResponseFileEmitter fileEmitter;
		private Subscription s;

		@Override
		public void onSubscribe(Subscription s) {
			this.s = s;
			s.request(64 * 1024);
		}

		@Override
		@SneakyThrows
		public void onNext(ByteBuffer t) {
			int l = t.capacity();
			byte[] b = new byte[l];
			t.get(b);
			fileEmitter.send(b, l);
		}

		@Override
		public void onError(Throwable t) {
			try {
				s.cancel();
			} catch (Throwable e) {
			}
			fileEmitter.completeWithError(t);
		}

		@Override
		public void onComplete() {
			try {
				s.cancel();
			} catch (Throwable t) {
			}
			fileEmitter.complete();
		}

	}
}
