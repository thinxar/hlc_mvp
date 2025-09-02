package com.palmyralabs.dms.dataload.service;

import java.io.File;
import java.io.FileFilter;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.palmyralabs.dms.dataload.client.PalmyraDMSClient;
import com.palmyralabs.dms.dataload.model.PolicyModel;
import com.palmyralabs.palmyra.client.exception.BadRequestException;

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
	private final Logger failureLogger = LoggerFactory.getLogger("com.palmyralabs.policyupload.failure");

	public void loadPolicy(String relativePath, String policyNumber) {
		Path parent = Paths.get(baseFolder, relativePath);
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
		String fileName = file.getName().toLowerCase();
		String[] matchers = { "~policy", "~poa", "~poi", "~proposal", "~medical", "~others~" };
		int i = 0;
		for (String matcher : matchers) {
			i++;
			if (fileName.contains(matcher))
				return i;
		}
		return matchers.length;
	}

	@SneakyThrows
	public void uploadFile(Integer policyId, Integer docketTypeId, Path filePath) {
		log.info("uploading file {} to policy {} with docket {}", filePath, policyId, docketTypeId);
		try {
			client.uploadFile(policyId, docketTypeId, filePath);
		} catch (BadRequestException bre) {
			Path relativePath = Paths.get(baseFolder).relativize(filePath);
			String errorMessage = bre.getMessage();
			if (null != errorMessage && errorMessage.toLowerCase().contains("file already exists")) {
				log.trace("Error while uploading {}, error - '{}'", relativePath.toString(), bre.getMessage());
			} else
				failureLogger.error("Error while uploading {}, error - '{}'", relativePath.toString(),
						bre.getMessage());
		}
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