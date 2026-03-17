package com.palmyralabs.dms.dataload.service;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;

public class DocketMatcher {
	private static final Map<String, Integer> dockets = new LinkedHashMap<String, Integer>();

	static {
		dockets.put("revival", 1);
	}

	public Integer getMatch(File file) {
		return dockets.get("revival");
	}
}
