package com.palmyralabs.dms.dataload.service;

import java.io.File;
import java.io.FileFilter;
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
	private final PalmyraDMSClient client;
	private final FileFilter filter = new PolicyFileFilter();
	private final PolicyReader csvReader = new PolicyReader();

	public void loadPolicy(String policyNumber) {
		Path parent = Paths.get(baseFolder);
		Path path = parent.resolve(policyNumber + ".csv");

		PolicyModel model = csvReader.parseCsv(path.toFile());
		if (null != model) {
			PolicyModel response = saveModel(model, client);
			uploadFiles(response.getId(), parent);
		}
	}

	public void uploadFiles(Integer policyId, Path parentDir) {
		File[] files = parentDir.toFile().listFiles(filter);
		for (File file : files) {
			Path filePath = parentDir.resolve(file.getName());
			uploadFile(policyId, getDocketType(file), filePath);
		}
	}

	private int getDocketType(File file) {
		return 2;
	}

	@SneakyThrows
	public void uploadFile(Integer policyId, Integer docketTypeId, Path filePath) {
		log.info("uploading file {} to policy {} with docket {}", filePath, policyId, docketTypeId);
		client.uploadFile(policyId, docketTypeId, filePath);
	}

	@SneakyThrows
	private PolicyModel saveModel(PolicyModel model, PalmyraDMSClient client) {
		return client.save(model);
	}

	private static class PolicyFileFilter implements FileFilter {

		@Override
		public boolean accept(File file) {
			String fileName = file.getName();
			return !fileName.endsWith(".csv");
		}

	}
}