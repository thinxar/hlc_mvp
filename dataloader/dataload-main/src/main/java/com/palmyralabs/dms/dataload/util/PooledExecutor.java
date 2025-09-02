package com.palmyralabs.dms.dataload.util;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class PooledExecutor {
	
	private ThreadPoolExecutor executor;	
	
	public PooledExecutor(int parallelUploads) {
		BlockingQueue<Runnable> queue = new LinkedBlockingQueue<Runnable>(parallelUploads * 100);
		RejectedExecutionHandler policy = new CallerAwaitPolicy();		
		this.executor = new ThreadPoolExecutor(parallelUploads, parallelUploads, 300, TimeUnit.SECONDS, queue, policy);
	}
	
	public void execute(Runnable r) {
		this.executor.execute(r);
	}

	private static class CallerAwaitPolicy implements RejectedExecutionHandler {

		@Override
		public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
			boolean queued = false;
			do {
				try {
					Thread.sleep(5 * 100);
				} catch (InterruptedException e) {

				}

				int capacityAvailable = executor.getQueue().remainingCapacity();
				if (capacityAvailable > 2) {
					executor.execute(r);
				}
			} while (!queued);
		}

	}

	public void awaitCompletion() {
		executor.shutdown();
	}
}
