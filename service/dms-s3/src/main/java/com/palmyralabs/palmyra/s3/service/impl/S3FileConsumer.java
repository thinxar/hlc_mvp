package com.palmyralabs.palmyra.s3.service.impl;

import java.nio.ByteBuffer;
import java.util.concurrent.ThreadPoolExecutor;

import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

import com.palmyralabs.palmyra.filemgmt.spring.FileEmitter;

import lombok.SneakyThrows;

class S3FileConsumer implements Subscriber<ByteBuffer> {

	private final ThreadPoolExecutor awsThreadPool;
	private final FileEmitter fileEmitter;
	private Subscription s;
	private int BUFFER_SIZE = 1 * 1024;
	private byte[] buffer;
	int bufferSize = 0;
	
	public S3FileConsumer(ThreadPoolExecutor threadPool, FileEmitter emitter, int bufferSize) {
		this.awsThreadPool = threadPool;
		this.fileEmitter = emitter;
		this.BUFFER_SIZE = bufferSize * 1024;
		this.buffer = new byte[BUFFER_SIZE];
	}

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
		awsThreadPool.submit(() -> {
			try {
				if (bufferSize > 0) {
					fileEmitter.send(buffer, bufferSize);
				}
				fileEmitter.complete();
			} catch (Throwable t) {
				fileEmitter.completeWithError(t);
			}
		});

		try {
			s.cancel();
		} catch (Throwable t) {
		}
	}
}
