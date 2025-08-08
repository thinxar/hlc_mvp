package com.palmyralabs.palmyra.s3.internal;

import java.net.URI;
import java.util.concurrent.CompletableFuture;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import software.amazon.awssdk.endpoints.Endpoint;
import software.amazon.awssdk.services.s3.endpoints.S3EndpointParams;
import software.amazon.awssdk.services.s3.endpoints.S3EndpointProvider;

@RequiredArgsConstructor
public class EndpointProvider implements S3EndpointProvider{

	private final String endPointUrl;
	
	@Override
	@SneakyThrows
	public CompletableFuture<Endpoint> resolveEndpoint(S3EndpointParams endpointParams) {
		Endpoint endPoint = Endpoint.builder().url(new URI(endPointUrl)).build();
		return CompletableFuture.completedFuture(endPoint);
	}
	
}
