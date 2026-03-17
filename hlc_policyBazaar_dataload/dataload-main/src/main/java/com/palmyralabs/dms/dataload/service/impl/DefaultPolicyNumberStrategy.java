package com.palmyralabs.dms.dataload.service.impl;

import java.nio.file.Path;

import com.palmyralabs.dms.dataload.service.PolicyNumberStrategy;

public class DefaultPolicyNumberStrategy implements PolicyNumberStrategy{

	@Override
	public String getPolicyNumber(Path folder) {
		return folder.getFileName().toString();
	}

	@Override
	public String getFileName(Path file) {
		return file.getFileName().toString();
	}

	@Override
	public Integer getPolicyNumber(Integer policyNumber) {
		return policyNumber;
	}

}
