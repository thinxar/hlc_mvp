package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.palmyralabs.dms.revival.entity.MonthWiseReportEntity;
import com.palmyralabs.dms.revival.model.DivisionPerformanceModel;
import com.palmyralabs.dms.revival.model.DoAgingBucketModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoSummaryService {

	private static final String PROCESSED_FIELD = "processedDocuments";
	private static final String PENDING_FIELD = "pendingDocuments";
	private static final String SUBMITTED_FIELD = "submittedDocuments";

	private final MongoTemplate mongoTemplate;

	public List<DivisionPerformanceModel> listDivisionPerformance(String doCode, int window) {
		if (doCode == null || doCode.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "doCode is required");
		}
		if (window <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "window must be positive");
		}

		LocalDate toMonth = LocalDate.now().withDayOfMonth(1);
		LocalDate fromMonth = toMonth.minusMonths(window - 1L);

		GroupOperation group = Aggregation.group("calMonth", "divisionName")
				.first("doCode").as("doCode")
				.sum(PROCESSED_FIELD).as(PROCESSED_FIELD)
				.sum(PENDING_FIELD).as(PENDING_FIELD)
				.sum(SUBMITTED_FIELD).as(SUBMITTED_FIELD);

		ProjectionOperation project = Aggregation
				.project("doCode", PROCESSED_FIELD, PENDING_FIELD, SUBMITTED_FIELD)
				.and("_id.calMonth").as("calMonth")
				.and("_id.divisionName").as("divisionName")
				.andExclude("_id");

		Aggregation agg = Aggregation.newAggregation(
				DoAggregationUtils.matchStage(doCode, fromMonth, toMonth),
				group,
				project,
				Aggregation.sort(Sort.Direction.ASC, "calMonth").and(Sort.Direction.ASC, "divisionName"));

		List<DivisionPerformanceModel> rows = new ArrayList<>(mongoTemplate
				.aggregate(agg, MonthWiseReportEntity.class, DivisionPerformanceModel.class)
				.getMappedResults());

		rows.forEach(DoSummaryService::populateDivisionPercentages);
		return rows;
	}

	public DoAgingBucketModel getAgingBuckets(String doCode, int window) {
		if (doCode == null || doCode.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "doCode is required");
		}
		if (window <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "window must be positive");
		}

		LocalDate toMonth = LocalDate.now().withDayOfMonth(1);
		LocalDate fromMonth = toMonth.minusMonths(window - 1L);

		GroupOperation group = Aggregation.group("doCode")
				.sum("pendingDocuments").as("pendingDocuments")
				.sum("ageingSummary.d0_5").as("d0_5")
				.sum("ageingSummary.d6_10").as("d6_10")
				.sum("ageingSummary.d11_20").as("d11_20")
				.sum("ageingSummary.d21_30").as("d21_30")
				.sum("ageingSummary.d31_45").as("d31_45")
				.sum("ageingSummary.d45plus").as("d45plus");

		ProjectionOperation project = Aggregation
				.project("pendingDocuments", "d0_5", "d6_10", "d11_20", "d21_30", "d31_45", "d45plus")
				.and("_id").as("doCode")
				.andExclude("_id");

		Aggregation agg = Aggregation.newAggregation(
				DoAggregationUtils.matchStage(doCode, fromMonth, toMonth), group, project);

		List<DoAgingBucketModel> rows = mongoTemplate
				.aggregate(agg, MonthWiseReportEntity.class, DoAgingBucketModel.class)
				.getMappedResults();

		return rows.isEmpty() ? zeroFilledBuckets(doCode) : rows.get(0);
	}

	private static void populateDivisionPercentages(DivisionPerformanceModel m) {
		long processed = m.getProcessedDocuments() == null ? 0L : m.getProcessedDocuments();
		long pending = m.getPendingDocuments() == null ? 0L : m.getPendingDocuments();
		long total = processed + pending;
		if (total == 0) {
			m.setPendingPercentage(0.0);
			m.setProcessedPercentage(0.0);
			return;
		}
		m.setPendingPercentage(DoAggregationUtils.round2(pending * 100.0 / total));
		m.setProcessedPercentage(DoAggregationUtils.round2(processed * 100.0 / total));
	}

	private static DoAgingBucketModel zeroFilledBuckets(String doCode) {
		DoAgingBucketModel empty = new DoAgingBucketModel();
		empty.setDoCode(doCode);
		empty.setPendingDocuments(0L);
		empty.setD0_5(0L);
		empty.setD6_10(0L);
		empty.setD11_20(0L);
		empty.setD21_30(0L);
		empty.setD31_45(0L);
		empty.setD45plus(0L);
		return empty;
	}
}
