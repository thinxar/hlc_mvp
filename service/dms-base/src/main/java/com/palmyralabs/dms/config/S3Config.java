package com.palmyralabs.dms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.palmyralabs.dms.model.S3Properties;

@Configuration
public class S3Config {
	
	@Bean
	public AmazonS3 amazonS3(S3Properties props) {
	    return AmazonS3ClientBuilder.standard()
	        .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(props.getEndpoint(), props.getRegion()))
	        .withCredentials(new AWSStaticCredentialsProvider(
	            new BasicAWSCredentials(props.getAccessKey(), props.getSecretKey())))
	        .withPathStyleAccessEnabled(true)
	        .build();
	}

}
