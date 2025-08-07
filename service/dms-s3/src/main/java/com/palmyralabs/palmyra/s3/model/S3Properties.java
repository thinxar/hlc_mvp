package com.palmyralabs.palmyra.s3.model;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@Primary
@ConfigurationProperties(prefix = "aws.s3")
public class S3Properties {
	private String bucketName;
    private String region;
    private String accessKey;
    private String secretKey;
    private String endpoint;
}
