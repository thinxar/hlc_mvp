package com.palmyralabs.dms.base.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@Configuration
public class SecurityConfigRepositoryConfig {

	private SecurityContextRepository repo = new HttpSessionSecurityContextRepository();


	@Bean
	public SecurityContextRepository getRepository() {
		return repo;
	}
}