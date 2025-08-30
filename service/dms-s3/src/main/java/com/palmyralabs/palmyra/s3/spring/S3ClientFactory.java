package com.palmyralabs.palmyra.s3.spring;

import java.net.URI;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.client.config.SdkAdvancedAsyncClientOption;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.utils.ThreadFactoryBuilder;

@Configuration
@RequiredArgsConstructor
public class S3ClientFactory {

	private final S3Config props;

	@Bean
	public S3AsyncClient amazonS3Async() {

		AwsCredentialsProvider crProvider = StaticCredentialsProvider
				.create(AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey()));

//		NettyNioAsyncHttpClient.Builder asyncHttpClientBuilder = NettyNioAsyncHttpClient.builder()
//		        .maxConcurrency(64)		        
//		        .connectionTimeout(Duration.ofSeconds(20))
//		        .connectionAcquisitionTimeout(Duration.ofSeconds(20));
//		

		ThreadPoolExecutor executor = new ThreadPoolExecutor(25, 25, 600, TimeUnit.SECONDS,
				new LinkedBlockingQueue<>(25), new ThreadFactoryBuilder().threadNamePrefix("sdk-asynsdf").build());

		// Allow idle core threads to time out
		executor.allowCoreThreadTimeOut(true);

		S3AsyncClient client = S3AsyncClient.builder().region(getRegion()).asyncConfiguration(
				b -> b.advancedOption(SdkAdvancedAsyncClientOption.FUTURE_COMPLETION_EXECUTOR, executor))
//				.httpClientBuilder(asyncHttpClientBuilder)
				.credentialsProvider(crProvider).endpointOverride(getEndPoint())
//				.endpointProvider(getEndPointProvider())
				.forcePathStyle(true).build();

		return client;
	}

	public void getAsyncConfiguration() {

	}

	@SneakyThrows
	private URI getEndPoint() {
		return new URI(props.getEndpoint());
	}

	@Bean
	public S3Client amazonS3(S3Config props) {

		AwsCredentialsProvider crProvider = StaticCredentialsProvider
				.create(AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey()));

		S3Client client = S3Client.builder().region(getRegion()).credentialsProvider(crProvider)
				.endpointOverride(getEndPoint()).forcePathStyle(true).build();

		return client;
	}

//	private S3EndpointProvider getEndPointProvider() {
//		return new EndpointProvider(props.getEndpoint());
//		// return BucketEndpointProvider.create(new DefaultS3EndpointProvider(), ()->
//		// getRegion());
//	}

	private Region getRegion() {
		return Region.of(props.getRegion());
	}

}
