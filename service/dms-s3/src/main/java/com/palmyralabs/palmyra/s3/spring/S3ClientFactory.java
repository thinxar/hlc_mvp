package com.palmyralabs.palmyra.s3.spring;

import java.net.URI;
import java.time.Duration;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.RejectedExecutionHandler;
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
import software.amazon.awssdk.http.async.SdkAsyncHttpClient;
import software.amazon.awssdk.http.nio.netty.NettyNioAsyncHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.utils.ThreadFactoryBuilder;

@Configuration
@RequiredArgsConstructor
public class S3ClientFactory {

	private final S3Config props;

	private ThreadPoolExecutor executor;

	@Bean(name = "awsThreadPool")
	public ThreadPoolExecutor getAwsThreadPPool() {
		if (null != executor)
			return executor;

		synchronized (props) {
			if(null != executor)
				return executor;
			
			RejectedExecutionHandler policy = new CallerAwaitPolicy();

			this.executor = new ThreadPoolExecutor(props.getCorePoolSize(), props.getMaximumPoolSize(),
					props.getKeepAliveTime(), TimeUnit.SECONDS,
					new LinkedBlockingQueue<>(props.getMaximumPoolSize() * 16),
					new ThreadFactoryBuilder().threadNamePrefix("sdk-async").build(), policy);

			// Allow idle core threads to time out
			executor.allowCoreThreadTimeOut(true);
			return executor;
		}
	}

	@Bean
	public S3AsyncClient amazonS3Async() {

		AwsCredentialsProvider crProvider = StaticCredentialsProvider
				.create(AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey()));

		NettyNioAsyncHttpClient.Builder asyncHttpClientBuilder = NettyNioAsyncHttpClient.builder()
				.maxConcurrency(props.getMaxConcurrency())
				.useNonBlockingDnsResolver(true)
				.connectionTimeout(Duration.ofSeconds(props.getConnectionTimeout()))
				.connectionAcquisitionTimeout(Duration.ofSeconds(props.getConnectionTimeout()));
		
		SdkAsyncHttpClient httpClient = asyncHttpClientBuilder.build();		

		ThreadPoolExecutor executor = getAwsThreadPPool();

		S3AsyncClient client = S3AsyncClient.builder().region(getRegion())
				.asyncConfiguration(
						b -> b.advancedOption(SdkAdvancedAsyncClientOption.FUTURE_COMPLETION_EXECUTOR, executor))
				.httpClient(httpClient)
				.credentialsProvider(crProvider)
				.endpointOverride(getEndPoint())
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

	private static class CallerAwaitPolicy implements RejectedExecutionHandler {

		@Override
		public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {

			do {
				try {
					Thread.sleep(100);
				} catch (InterruptedException e) {

				}

				int capacityAvailable = executor.getQueue().remainingCapacity();
				if (capacityAvailable > 2) {
					executor.execute(r);
					return;
				}
			} while (true);
		}

	}
}
