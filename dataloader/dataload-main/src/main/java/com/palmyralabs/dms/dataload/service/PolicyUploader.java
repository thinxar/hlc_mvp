package com.palmyralabs.dms.dataload.service;

import java.nio.file.Path;
import java.nio.file.Paths;

import com.palmyralabs.dms.dataload.client.PalmyraDMSClient;
import com.palmyralabs.dms.dataload.model.PolicyModel;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class PolicyUploader {
	private final String baseFolder;
	private final PolicyReader csvReader = new PolicyReader();
	
	public void loadPolicy(String policyNumber, PalmyraDMSClient client) {
		Path path = Paths.get(baseFolder,  policyNumber, policyNumber + ".csv");
		
		PolicyModel model = csvReader.parseCsv(path.toFile());
		if(null != model) {
			PolicyModel response = saveModel(model, client);
			uploadFiles(response);
		}
	}

	private void uploadFiles(PolicyModel response) {
				
	}

	@SneakyThrows
	private PolicyModel saveModel(PolicyModel model, PalmyraDMSClient client) {
		return client.save(model);
	}
}