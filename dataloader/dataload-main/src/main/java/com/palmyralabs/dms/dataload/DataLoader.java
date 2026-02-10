package com.palmyralabs.dms.dataload;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.dataload.client.PalmyraDMSClient;
import com.palmyralabs.dms.dataload.service.PolicyFileUploader;
import com.palmyralabs.dms.dataload.service.PolicyNumberStrategy;
import com.palmyralabs.dms.dataload.service.PolicyUploader;
import com.palmyralabs.dms.dataload.service.impl.DefaultPolicyNumberStrategy;
import com.palmyralabs.dms.dataload.util.FolderUtil;
import com.palmyralabs.dms.dataload.util.PooledExecutor;
import com.palmyralabs.palmyra.client.exception.ClientException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class DataLoader implements CommandLineRunner {

	@Autowired
	private UploadConfig uploadConfig;

	private PolicyNumberStrategy strategy = new DefaultPolicyNumberStrategy();

	@Override
	public void run(String... args) throws Exception {
		try {
			PalmyraDMSClient client = new PalmyraDMSClient(uploadConfig.getUrl(), "palmyra/");
			client.login(uploadConfig.getUsername(), uploadConfig.getPassword());
			Path baseFolder = Paths.get(uploadConfig.getPolicyFolder());

			PolicyUploader loader = new PolicyUploader(baseFolder, client);
			PooledExecutor executor = new PooledExecutor(uploadConfig.getParallel());
			
			PolicyFileUploader fileUploader = new PolicyFileUploader(baseFolder, loader, strategy, executor);			
			FolderUtil.processPolicy(baseFolder, fileUploader);
			executor.awaitCompletion();
		} catch (ClientException ce) {
			log.error("Error while loading data - {}", ce.getMessage());
		} catch (Throwable t) {
			log.error("Error while loading data", t);
		}
	}
}
