package com.palmyralabs.dms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import com.palmyralabs.palmyra.spring.PalmyraSpringConfiguration;

@SpringBootApplication
@Import(PalmyraSpringConfiguration.class)
@ComponentScan(value = { "com.palmyralabs.dms", "com.palmyralabs.palmyra.enhancer"})
@EnableJpaRepositories
@EntityScan
@EnableMethodSecurity
public class AppMain {

	public static void main(String[] args) {
		SpringApplication.run(AppMain.class, args);
	}
}