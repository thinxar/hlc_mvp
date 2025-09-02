package com.palmyralabs.dms.dataload;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.upload")
public class UploadConfig {
	private String url;
	private String username;
	private String password;
	private String policyFolder;
}
