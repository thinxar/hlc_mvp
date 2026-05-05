package com.palmyralabs.dms.dataload.service;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;

public class DocketMatcher {
	private static final Map<String, Integer> dockets = new LinkedHashMap<String, Integer>();

	static {
		dockets.put("kyc", 1);
		dockets.put("neft",2);
		dockets.put("signature",3);
		dockets.put("others", 4);
	}

	public Integer getMatch(File file) {
		String fileName = file.getName().toLowerCase();
		for (String matcher : dockets.keySet()) {
			if (fileName.contains(matcher))
			{
				return dockets.get(matcher);				
			}
		}
		return 4;
	}
}
