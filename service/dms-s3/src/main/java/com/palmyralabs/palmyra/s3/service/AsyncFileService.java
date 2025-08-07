package com.palmyralabs.palmyra.s3.service;

import java.nio.ByteBuffer;
import java.util.concurrent.CompletableFuture;

import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.core.async.ResponsePublisher;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncFileService {
	private final S3AsyncClient asyncClient;

	@Async
	public void downloadFile(String key, ResponseFileEmitter emitter) {

		GetObjectRequest request = GetObjectRequest.builder().key(key).build();

		CompletableFuture<ResponsePublisher<GetObjectResponse>> cplResponse = asyncClient.getObject(request,
				AsyncResponseTransformer.toPublisher());

		ResponsePublisher<GetObjectResponse> publisher = cplResponse.join();

//		GetObjectResponse response = publisher.response();

		publisher.subscribe(new S3FileConsumer(emitter));

	}

	@RequiredArgsConstructor
	private static final class S3FileConsumer implements Subscriber<ByteBuffer> {

		private final ResponseFileEmitter fileEmitter;

		@Override
		public void onSubscribe(Subscription s) {

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
			fileEmitter.completeWithError(t);
		}

		@Override
		public void onComplete() {
			fileEmitter.complete();
		}

	}
}
