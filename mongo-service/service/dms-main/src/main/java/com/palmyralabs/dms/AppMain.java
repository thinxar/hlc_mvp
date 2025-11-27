package com.palmyralabs.dms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication()
@ComponentScan(value = { "com.palmyralabs.dms", "com.palmyralabs.palmyra.enhancer", "com.palmyralabs.palmyra.filemgmt", "com.palmyralabs.palmyra.s3"})
@EnableMongoAuditing
@EnableMethodSecurity
@EnableAsync
public class AppMain {

	public static void main(String[] args) {
		SpringApplication.run(AppMain.class, args);
	}
}