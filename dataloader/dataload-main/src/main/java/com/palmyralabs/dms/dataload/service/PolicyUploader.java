package com.palmyralabs.dms.dataload.service;

import java.io.File;
import java.io.FileFilter;
import java.nio.file.Path;

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
	private final Path baseFolder;
	private final PalmyraDMSClient client;
	private final DocketMatcher matcher = new DocketMatcher();
	private final FileFilter filter = new PolicyFileFilter();
	private final PolicyReader csvReader = new PolicyReader();
	private final Logger failureLogger = LoggerFactory.getLogger("com.palmyralabs.policyupload.failure");

	public void loadPolicy(Path relativePath, PolicyNumberStrategy strategy) {
		Path parent = baseFolder.resolve(relativePath);

		String metadataFile = strategy.getPolicyMetaDataFile(relativePath);
		log.info("Loading policy from {}/{}",  relativePath, metadataFile);
		Path path = parent.resolve(metadataFile);

		PolicyModel model = csvReader.parseCsv(path.toFile());
		if (null != model) {
			model.setPolicyNumber(strategy.getPolicyNumber(model.getPolicyNumber()));
			PolicyModel response = saveModel(model, client);
			
			uploadFiles(response.getId(), parent, strategy);
		}
	}

	public void uploadFiles(Integer policyId, Path parentDir, PolicyNumberStrategy strategy) {
		File[] files = parentDir.toFile().listFiles(filter);
		for (File file : files) {
			System.out.println("uploading file " + file.getName());
			Path filePath = parentDir.resolve(file.getName());
			uploadFile(policyId, matcher.getMatch(file), filePath, strategy);
			System.out.println("completed file upload" + file.getName());
		}
	}

//	private int getDocketType(File file) {
//		String fileName = file.getName().toLowerCase();
//		String[] matchers = { "~policy", "~poa", "~poi", "~proposal", "~medical", "~others~" };
//		int i = 0;
//		for (String matcher : matchers) {
//			i++;
//			if (fileName.contains(matcher))
//				return i;
//		}
//		return matchers.length;
//	}

	@SneakyThrows
	public void uploadFile(Integer policyId, Integer docketTypeId, Path filePath, PolicyNumberStrategy strategy) {
		Path relativePath = baseFolder.relativize(filePath);
		log.info("uploading file {} to policy {} with docket {}", relativePath, policyId, docketTypeId);
		try {
			client.uploadFile(policyId, docketTypeId, filePath);
		} catch (BadRequestException bre) {			
			String errorMessage = bre.getMessage();
			if (null != errorMessage && errorMessage.toLowerCase().contains("file already exists")) {
				log.trace("Error while uploading {}, error - '{}'", relativePath.toString(), bre.getMessage());
			} else
				failureLogger.error("Error while uploading {}, error - '{}'", relativePath.toString(),
						bre.getMessage());
		}catch(Throwable t) {
			log.error("Error while uploading {}, error - '{}'", relativePath.toString(),
					t.getMessage());
			failureLogger.error("Error while uploading {}, error - '{}'", relativePath.toString(),
					t.getMessage());
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