package com.palmyralabs.dms.dataload;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

import com.palmyralabs.dms.dataload.client.PalmyraDMSClient;
import com.palmyralabs.dms.dataload.service.PolicyUploader;
import com.palmyralabs.palmyra.client.exception.ClientException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@EnableAsync
@SpringBootApplication()
@ComponentScan(value = { "com.palmyralabs.dms" })
public class DataLoadMain implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(DataLoadMain.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		try {
			PalmyraDMSClient client = new PalmyraDMSClient("http://localhost:7070/api/", "palmyra/");
			client.login("admin@gmail.com", "ad");

			PolicyUploader loader = new PolicyUploader("/home/ksvraja/test_data/dev/hpe/lic/597934126", client);
			loader.loadPolicy("597934126");

		} catch (ClientException ce) {
			log.error("Error while loading data - {}", ce.getMessage());
		} catch (Throwable t) {
			log.error("Error while loading data", t);
		}
	}
}