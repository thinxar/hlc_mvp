package com.palmyralabs.palmyra.s3.service.impl;

import java.nio.ByteBuffer;

import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;

@RequiredArgsConstructor
class S3FileConsumer implements Subscriber<ByteBuffer> {
	private static final int BUFFER_SIZE = 64 * 1024;

	private final ResponseFileEmitter fileEmitter;
	private Subscription s;

	private byte[] buffer = new byte[BUFFER_SIZE];
	int bufferSize = 0;

	@Override
	public void onSubscribe(Subscription s) {
		this.s = s;
		s.request(BUFFER_SIZE);
	}

	@Override
	@SneakyThrows
	public void onNext(ByteBuffer t) {
		int l = t.capacity();

		if (l + bufferSize >= BUFFER_SIZE) {
			int remainingCapacity = BUFFER_SIZE - bufferSize;
			t.get(buffer, bufferSize, remainingCapacity);
			fileEmitter.send(buffer, BUFFER_SIZE);
			bufferSize = l - remainingCapacity;
			t.get(buffer, 0, bufferSize);
		} else {
			t.get(buffer, bufferSize, l);
			bufferSize += l;
		}
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
			if (bufferSize > 0) {
				fileEmitter.send(buffer, bufferSize);
			}
		} catch (Throwable t) {

		}

		try {
			s.cancel();
		} catch (Throwable t) {
		}
		fileEmitter.complete();
	}
}
