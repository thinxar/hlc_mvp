package com.palmyralabs.dms.dataload.service;

import java.io.File;

public class DocketTypeManager {

	String[] matchers = { "~policy", "~medical", "~proposal", "~poa", "~poi", "~others" };
	int[] values = { 1, 5, 4, 2, 3, 6 };

	public int getDocketType(File file) {
		String fileName = file.getName().toLowerCase();

		int i = 0;
		for (String matcher : matchers) {
			if (fileName.contains(matcher))
				return values[i];
		}
		return matchers.length;
	}
}
