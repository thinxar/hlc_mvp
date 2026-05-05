package com.palmyralabs.dms.dataload;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@EnableAsync
@SpringBootApplication()
public class DataLoadMain {	
	
	public static void main(String[] args) {
		SpringApplication.run(DataLoadMain.class, args);
	}

	
}