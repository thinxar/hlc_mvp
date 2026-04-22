package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;

import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.Criteria;

final class DoAggregationUtils {

	private DoAggregationUtils() {
	}

	static MatchOperation matchStage(String doCode, LocalDate fromMonth, LocalDate toMonth) {
		return Aggregation.match(new Criteria().andOperator(
				Criteria.where("doCode").is(doCode),
				Criteria.where("calMonth").gte(fromMonth).lte(toMonth)));
	}

	static double round2(double value) {
		return Math.round(value * 100.0) / 100.0;
	}
}
