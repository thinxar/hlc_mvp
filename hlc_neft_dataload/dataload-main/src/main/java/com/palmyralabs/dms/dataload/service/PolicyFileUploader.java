package com.palmyralabs.dms.dataload.service;

import java.nio.file.Path;
import java.util.function.Consumer;

import com.palmyralabs.dms.dataload.util.PooledExecutor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class PolicyFileUploader implements Consumer<Path> {
	private final Path baseFolder;
	private final PolicyUploader uploader;
	private final PolicyNumberStrategy strategy;
	private final PooledExecutor executor;

	@Override
	public void accept(Path t) {
		executor.execute(new Uploader(t));
	}

	@RequiredArgsConstructor
	private class Uploader implements Runnable {

		private final Path policyPath;

		@Override
		public void run() {
			try {
				Path relativePath = baseFolder.relativize(policyPath);
				uploader.loadPolicy(relativePath, strategy);
			} catch (Throwable t) {
				log.error("Error while running uploader", t);
			}
		}
	}
}
