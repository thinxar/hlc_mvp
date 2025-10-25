package com.palmyralabs.palmyra.filemgmt.spring;

import java.io.IOException;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.function.Consumer;

import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.util.Assert;
import org.springframework.util.ObjectUtils;

public class ResponseFileEmitter implements FileEmitter{
	
	@Nullable
	private String contentType;
	 
	@Nullable
	private final Long timeout;

	@Nullable
	private Handler handler;

	/** Store send data before handler is initialized. */
	private final Set<byte[]> earlySendAttempts = new LinkedHashSet<>(8);

	/** Store successful completion before the handler is initialized. */
	private boolean complete;

	/** Store an error before the handler is initialized. */
	@Nullable
	private Throwable failure;

	/**
	 * After an I/O error, we don't call {@link #completeWithError} directly but
	 * wait for the Servlet container to call us via {@code AsyncListener#onError}
	 * on a container thread at which point we call completeWithError.
	 * This flag is used to ignore further calls to complete or completeWithError
	 * that may come for example from an application try-catch block on the
	 * thread of the I/O error.
	 */
	private boolean ioErrorOnSend;

	private final DefaultCallback timeoutCallback = new DefaultCallback();

	private final ErrorCallback errorCallback = new ErrorCallback();

	private final DefaultCallback completionCallback = new DefaultCallback();


	/**
	 * Create a new ResponseFileEmitter instance.
	 */
	public ResponseFileEmitter() {
		this.timeout = null;
	}

	/**
	 * Create a ResponseFileEmitter with a custom timeout value.
	 * <p>By default not set in which case the default configured in the MVC
	 * Java Config or the MVC namespace is used, or if that's not set, then the
	 * timeout depends on the default of the underlying server.
	 * @param timeout the timeout value in milliseconds
	 */
	public ResponseFileEmitter(Long timeout) {
		this.timeout = timeout;
	}


	/**
	 * Return the configured timeout value, if any.
	 */
	
	public synchronized void setContentType(String contentType) {
	        this.contentType = contentType;
	}
	 
	@Nullable
	public Long getTimeout() {
		return this.timeout;
	}

	synchronized void initialize(Handler handler) throws IOException {
		this.handler = handler;

		try {
			sendInternal(this.earlySendAttempts);
		}
		finally {
			this.earlySendAttempts.clear();
		}

		if (this.complete) {
			if (this.failure != null) {
				this.handler.completeWithError(this.failure);
			}
			else {
				this.handler.complete();
			}
		}
		else {
			this.handler.onTimeout(this.timeoutCallback);
			this.handler.onError(this.errorCallback);
			this.handler.onCompletion(this.completionCallback);
		}
	}

	synchronized void initializeWithError(Throwable ex) {
		this.complete = true;
		this.failure = ex;
		this.earlySendAttempts.clear();
		this.errorCallback.accept(ex);
	}

	/**
	 * Invoked after the response is updated with the status code and headers,
	 * if the ResponseFileEmitter is wrapped in a ResponseEntity, but before the
	 * response is committed, i.e. before the response body has been written to.
	 * <p>The default implementation is empty.
	 */
	protected void extendResponse(ServerHttpResponse outputMessage) {
        if (this.contentType != null && !this.contentType.isEmpty()) {
            outputMessage.getHeaders().set("Content-Type", this.contentType);
        }
 }
	
	/**
	 * Overloaded variant of {@link #send(Object)} that also accepts a MediaType
	 * hint for how to serialize the given Object.
	 * @param object the object to write
	 * @param mediaType a MediaType hint for selecting an HttpMessageConverter
	 * @throws IOException raised when an I/O error occurs
	 * @throws java.lang.IllegalStateException wraps any other errors
	 */
	public synchronized void send(byte[] data, int length) throws IOException {
		Assert.state(!this.complete, () -> "ResponseFileEmitter has already completed" +
				(this.failure != null ? " with error: " + this.failure : ""));
		if (this.handler != null) {
			try {
				this.handler.send(data, length);
			}
			catch (IOException ex) {
				this.ioErrorOnSend = true;
				throw ex;
			}
			catch (Throwable ex) {
				throw new IllegalStateException("Failed to send " + data, ex);
			}
		}
		else {
			byte[] t = new byte[length];
			System.arraycopy(data, 0, t, 0, length);
			this.earlySendAttempts.add(t);
		}
	}


	private void sendInternal(Set<byte[]> items) throws IOException {
		if (items.isEmpty()) {
			return;
		}
		if (this.handler != null) {
			try {
				this.handler.send(items);
			}
			catch (IOException ex) {
				this.ioErrorOnSend = true;
				throw ex;
			}
			catch (Throwable ex) {
				throw new IllegalStateException("Failed to send " + items, ex);
			}
		}
		else {
			this.earlySendAttempts.addAll(items);
		}
	}

	/**
	 * Complete request processing by performing a dispatch into the servlet
	 * container, where Spring MVC is invoked once more, and completes the
	 * request processing lifecycle.
	 * <p><strong>Note:</strong> this method should be called by the application
	 * to complete request processing. It should not be used after container
	 * related events such as an error while {@link #send(Object) sending}.
	 */
	public synchronized void complete() {
		// Ignore complete after IO failure on send
		if (this.ioErrorOnSend) {
			return;
		}
		this.complete = true;
		if (this.handler != null) {
			this.handler.complete();
		}
	}

	/**
	 * Complete request processing with an error.
	 * <p>A dispatch is made into the app server where Spring MVC will pass the
	 * exception through its exception handling mechanism. Note however that
	 * at this stage of request processing, the response is committed and the
	 * response status can no longer be changed.
	 * <p><strong>Note:</strong> this method should be called by the application
	 * to complete request processing with an error. It should not be used after
	 * container related events such as an error while
	 * {@link #send(Object) sending}.
	 */
	public synchronized void completeWithError(Throwable ex) {
		// Ignore complete after IO failure on send
		if (this.ioErrorOnSend) {
			return;
		}
		this.complete = true;
		this.failure = ex;
		if (this.handler != null) {
			this.handler.completeWithError(ex);
		}
	}

	/**
	 * Register code to invoke when the async request times out. This method is
	 * called from a container thread when an async request times out.
	 */
	public synchronized void onTimeout(Runnable callback) {
		this.timeoutCallback.setDelegate(callback);
	}

	/**
	 * Register code to invoke for an error during async request processing.
	 * This method is called from a container thread when an error occurred
	 * while processing an async request.
	 * @since 5.0
	 */
	public synchronized void onError(Consumer<Throwable> callback) {
		this.errorCallback.setDelegate(callback);
	}

	/**
	 * Register code to invoke when the async request completes. This method is
	 * called from a container thread when an async request completed for any
	 * reason including timeout and network error. This method is useful for
	 * detecting that a {@code ResponseFileEmitter} instance is no longer usable.
	 */
	public synchronized void onCompletion(Runnable callback) {
		this.completionCallback.setDelegate(callback);
	}


	@Override
	public String toString() {
		return "ResponseFileEmitter@" + ObjectUtils.getIdentityHexString(this);
	}


	/**
	 * Contract to handle the sending of event data, the completion of event
	 * sending, and the registration of callbacks to be invoked in case of
	 * timeout, error, and completion for any reason (including from the
	 * container side).
	 */
	public interface Handler {
		
		void send(byte[] data, int length) throws IOException;

		void send(Set<byte[]> items) throws IOException; 

		void complete();

		void completeWithError(Throwable failure);

		void onTimeout(Runnable callback);

		void onError(Consumer<Throwable> callback);

		void onCompletion(Runnable callback);
	}
	
	private class DefaultCallback implements Runnable {

		@Nullable
		private Runnable delegate;

		public void setDelegate(Runnable delegate) {
			this.delegate = delegate;
		}

		@Override
		public void run() {
			ResponseFileEmitter.this.complete = true;
			if (this.delegate != null) {
				this.delegate.run();
			}
		}
	}


	private class ErrorCallback implements Consumer<Throwable> {

		@Nullable
		private Consumer<Throwable> delegate;

		public void setDelegate(Consumer<Throwable> callback) {
			this.delegate = callback;
		}

		@Override
		public void accept(Throwable t) {
			ResponseFileEmitter.this.complete = true;
			if (this.delegate != null) {
				this.delegate.accept(t);
			}
		}
	}	
}
