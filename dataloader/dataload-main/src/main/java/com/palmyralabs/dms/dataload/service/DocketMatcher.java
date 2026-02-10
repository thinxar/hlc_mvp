package com.palmyralabs.dms.dataload.service;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;

public class DocketMatcher {
	private static final Map<String, Integer> dockets = new LinkedHashMap<String, Integer>();

	static {
		dockets.put("~policy", 1);
		dockets.put("~poa",2);
		dockets.put("~poi",3);
		dockets.put("~proposal_form", 7);
		dockets.put("~proposal_enclosure", 9);
		dockets.put("~proposal",4);
		dockets.put("~medical", 5);
		
		dockets.put("~kyc_document", 8);
		dockets.put("~signature", 10);
		dockets.put("~surrender", 13);
		dockets.put("~neft", 14);
		dockets.put("~endorsement", 15);
		dockets.put("~others~", 6);		
	}
	
	public Integer getMatch(File file) {
		String fileName = file.getName().toLowerCase();
		String[] matchers = { "~policy", "~poa", "~poi", "~proposal", "~medical", "~others~" };
		int i = 1;
		for (String matcher : dockets.keySet()) {
			if (fileName.contains(matcher))
			{
				return dockets.get(matcher);				
			}
		}
		return 6;
	}
}
