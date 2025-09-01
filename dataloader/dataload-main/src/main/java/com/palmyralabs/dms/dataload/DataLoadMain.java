package com.palmyralabs.dms.dataload;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

import com.palmyralabs.dms.dataload.client.PalmyraDMSClient;
import com.palmyralabs.dms.dataload.model.PolicyModel;

@SpringBootApplication()
@ComponentScan(value = { "com.palmyralabs.dms" })
@EnableAsync
public class DataLoadMain implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(DataLoadMain.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		PalmyraDMSClient client = new PalmyraDMSClient("http://localhost:7070/api/", "palmyra/");
		client.login("admin@gmail.com", "ad");
		List<PolicyModel> policies = client.getPolicyByNumber("782002020");
		System.out.println(policies.size());
	}
}