package com.palmyralabs.palmyra.filemgmt.spring;

import java.io.IOException;
import java.util.Set;
import java.util.function.Consumer;

import org.springframework.core.MethodParameter;
import org.springframework.core.ResolvableType;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.DelegatingServerHttpResponse;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.util.Assert;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.context.request.async.WebAsyncUtils;
import org.springframework.web.filter.ShallowEtagHeaderFilter;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.method.support.ModelAndViewContainer;

import jakarta.servlet.ServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class FileEmitterReturnValueHandler implements HandlerMethodReturnValueHandler {

	@Override
	public boolean supportsReturnType(MethodParameter returnType) {
		Class<?> bodyType = ResponseEntity.class.isAssignableFrom(returnType.getParameterType())
				? ResolvableType.forMethodParameter(returnType).getGeneric().resolve()
				: returnType.getParameterType();

		return (bodyType != null && (ResponseFileEmitter.class.isAssignableFrom(bodyType)));
	}

	@Override
	@SuppressWarnings("resource")
	public void handleReturnValue(Object returnValue, MethodParameter returnType, ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest) throws Exception {
		if (returnValue == null) {
			mavContainer.setRequestHandled(true);
			return;
		}

		HttpServletResponse response = webRequest.getNativeResponse(HttpServletResponse.class);
		Assert.state(response != null, "No HttpServletResponse");
		ServerHttpResponse outputMessage = new ServletServerHttpResponse(response);

		if (returnValue instanceof ResponseEntity<?> responseEntity) {
			response.setStatus(responseEntity.getStatusCode().value());
			outputMessage.getHeaders().putAll(responseEntity.getHeaders());
			returnValue = responseEntity.getBody();
			returnType = returnType.nested();
			if (returnValue == null) {
				mavContainer.setRequestHandled(true);
				outputMessage.flush();
				return;
			}
		}

		ServletRequest request = webRequest.getNativeRequest(ServletRequest.class);
		Assert.state(request != null, "No ServletRequest");

		ResponseFileEmitter emitter;
		if (returnValue instanceof ResponseFileEmitter responseBodyEmitter) {
			emitter = responseBodyEmitter;
		}else {
			return;
		}
//		else {
//			emitter = this.reactiveHandler.handleValue(returnValue, returnType, mavContainer, webRequest);
//			if (emitter == null) {
//				// Not streaming: write headers without committing response..
//				outputMessage.getHeaders().forEach((headerName, headerValues) -> {
//					for (String headerValue : headerValues) {
//						response.addHeader(headerName, headerValue);
//					}
//				});
//				return;
//			}
//		}
		emitter.extendResponse(outputMessage);

		// At this point we know we're streaming..
		ShallowEtagHeaderFilter.disableContentCaching(request);

		// Wrap the response to ignore further header changes
		// Headers will be flushed at the first write
		outputMessage = new StreamingServletServerHttpResponse(outputMessage);

		HttpMessageConvertingHandler handler;
		try {
			DeferredResult<?> deferredResult = new DeferredResult<>(emitter.getTimeout());
			WebAsyncUtils.getAsyncManager(webRequest).startDeferredResultProcessing(deferredResult, mavContainer);
			handler = new HttpMessageConvertingHandler(outputMessage, deferredResult);
		}
		catch (Throwable ex) {
			emitter.initializeWithError(ex);
			throw ex;
		}

		emitter.initialize(handler);
	}
	
	/**
	 * ResponseBodyEmitter.Handler that writes with HttpMessageConverter's.
	 */
	private class HttpMessageConvertingHandler implements ResponseFileEmitter.Handler {

		private final ServerHttpResponse outputMessage;

		private final DeferredResult<?> deferredResult;

		public HttpMessageConvertingHandler(ServerHttpResponse outputMessage, DeferredResult<?> deferredResult) {
			this.outputMessage = outputMessage;
			this.deferredResult = deferredResult;
		}

		@Override
		public void send(byte[] data, int length) throws IOException {
			sendInternal(data, length);
			this.outputMessage.flush();
		}

		@Override
		public void send(Set<byte[]> items) throws IOException {
			for (byte[] item : items) {
				sendInternal(item, item.length);
			}
			this.outputMessage.flush();
		}

		private void sendInternal(byte[] data, int length) throws IOException {
			this.outputMessage.getBody().write(data, 0, length);			
		}

		@Override
		public void complete() {
			try {
				this.outputMessage.flush();
				this.deferredResult.setResult(null);
			}
			catch (IOException ex) {
				this.deferredResult.setErrorResult(ex);
			}
		}

		@Override
		public void completeWithError(Throwable failure) {
			this.deferredResult.setErrorResult(failure);
		}

		@Override
		public void onTimeout(Runnable callback) {
			this.deferredResult.onTimeout(callback);
		}

		@Override
		public void onError(Consumer<Throwable> callback) {
			this.deferredResult.onError(callback);
		}

		@Override
		public void onCompletion(Runnable callback) {
			this.deferredResult.onCompletion(callback);
		}
	}


	/**
	 * Wrap to silently ignore header changes HttpMessageConverter's that would
	 * otherwise cause HttpHeaders to raise exceptions.
	 */
	private static class StreamingServletServerHttpResponse extends DelegatingServerHttpResponse {

		private final HttpHeaders mutableHeaders = new HttpHeaders();

		public StreamingServletServerHttpResponse(ServerHttpResponse delegate) {
			super(delegate);
			this.mutableHeaders.putAll(delegate.getHeaders());
		}

		@Override
		public HttpHeaders getHeaders() {
			return this.mutableHeaders;
		}

	}

}
