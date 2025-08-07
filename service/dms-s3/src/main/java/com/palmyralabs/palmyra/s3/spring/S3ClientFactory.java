package com.palmyralabs.palmyra.s3.spring;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.endpoints.S3EndpointProvider;
import software.amazon.awssdk.services.s3.endpoints.internal.DefaultS3EndpointProvider;
import software.amazon.awssdk.services.s3.internal.crossregion.endpointprovider.BucketEndpointProvider;

@Configuration
@RequiredArgsConstructor
public class S3ClientFactory {

	private final S3Config props;
	
	@Bean
	public S3AsyncClient amazonS3Async() {
		
		AwsCredentialsProvider crProvider = StaticCredentialsProvider.create(AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey()));

		S3AsyncClient client = S3AsyncClient.builder().region(getRegion())
				.credentialsProvider(crProvider)
				.endpointProvider(getEndPointProvider())
				.forcePathStyle(true)
				.build();
		
		return client;
	}
	
	@Bean
	public S3Client amazonS3(S3Config props) {
		
		AwsCredentialsProvider crProvider = StaticCredentialsProvider.create(AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey()));

		S3Client client = S3Client.builder().region(getRegion())
				.credentialsProvider(crProvider)
				.endpointProvider(getEndPointProvider())
				.forcePathStyle(true)
				.build();
		
		return client;
	}

	private S3EndpointProvider getEndPointProvider() {
		return BucketEndpointProvider.create(new DefaultS3EndpointProvider(), ()-> getRegion());		
	}

	private Region getRegion() {
		return Region.AP_SOUTH_1;
	}

}
