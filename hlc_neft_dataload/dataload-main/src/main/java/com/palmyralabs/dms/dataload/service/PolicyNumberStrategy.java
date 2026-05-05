package com.palmyralabs.dms.dataload.service;

import java.nio.file.Path;

public interface PolicyNumberStrategy {
	public String getPolicyNumber(Path folder);

	public default String getPolicyMetaDataFile(Path folder) {
		return folder.getFileName().toString() + ".csv";
	}

	public String getFileName(Path file);

	public Integer getPolicyNumber(Integer policyNumber);
}
