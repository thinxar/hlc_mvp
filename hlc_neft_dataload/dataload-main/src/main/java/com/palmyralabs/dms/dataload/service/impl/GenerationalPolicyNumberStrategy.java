package com.palmyralabs.dms.dataload.service.impl;

import java.nio.file.Path;

import com.palmyralabs.dms.dataload.service.PolicyNumberStrategy;

public class GenerationalPolicyNumberStrategy implements PolicyNumberStrategy {

	private String currentValue;

	public GenerationalPolicyNumberStrategy(int start) {
		this.currentValue = String.valueOf(start);
	}

	@Override
	public String getPolicyNumber(Path folder) {
		return generate(folder.getFileName().toString());
	}

	@Override
	public String getFileName(Path file) {
		return generate(file.getFileName().toString());
	}

	@Override
	public Integer getPolicyNumber(Integer policyNumber) {
		if (null == policyNumber)
			return null;
		String p = String.valueOf(policyNumber);
		return Integer.parseInt(generate(p));
	}

	private String generate(String policyNumber) {
		int l = currentValue.length();
		StringBuilder sb = new StringBuilder();
		sb.append(currentValue);
		sb.append(policyNumber.substring(l));
		return sb.toString();
	}

}
