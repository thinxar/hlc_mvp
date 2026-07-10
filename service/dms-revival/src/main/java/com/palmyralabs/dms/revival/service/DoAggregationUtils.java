package com.palmyralabs.dms.revival.service;

// TODO: Postgres migration - original Mongo aggregation preserved at claude/service/dms_revival/_mongo_original/DoAggregationUtils.java.txt
final class DoAggregationUtils {

	private DoAggregationUtils() {
	}

	static double round2(double value) {
		return Math.round(value * 100.0) / 100.0;
	}
}
