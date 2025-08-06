package com.palmyralabs.dms.base.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	private final SecurityContextRepository repo;

	@Bean
	public SecurityFilterChain configurePublicEndpoints(HttpSecurity http) throws Exception {

		SecurityContextRepository securityContextRepository = new RequestAttributeSecurityContextRepository();

		SecurityContextRepository delegatedRepo = new DelegatingSecurityContextRepository(securityContextRepository,
				repo);

		http.securityContext(context -> {
			context.securityContextRepository(delegatedRepo);
		});

		http.csrf(t -> {
			t.disable();
		}).authorizeHttpRequests(
				(requests) -> requests
				        .requestMatchers("/auth/login","/palmyra/public/**", "/palmyra/public/citizen/**")
						.permitAll()
						.anyRequest().authenticated());
		http.exceptionHandling((r) -> {
			r.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
		});
		return http.build();
	}
}
