package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.palmyralabs.dms.revival.entity.MonthWiseReportEntity;
import com.palmyralabs.dms.revival.model.BranchPerformanceModel;
import com.palmyralabs.dms.revival.model.DoAgingBucketModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoDashboardService {

	private static final String PROCESSED_FIELD = "processedDocuments";
	private static final String PENDING_FIELD = "pendingDocuments";
	private static final String SUBMITTED_FIELD = "submittedDocuments";

	private final MongoTemplate mongoTemplate;

	public List<BranchPerformanceModel> getBranchProcessed(String doCode, String order,
			int count, int window) {
		return rankBranches(doCode, order, count, window, PROCESSED_FIELD);
	}

	public List<BranchPerformanceModel> getBranchPending(String doCode, String order,
			int count, int window) {
		return rankBranches(doCode, order, count, window, PENDING_FIELD);
	}

	public List<BranchPerformanceModel> getBranchSubmitted(String doCode, String order,
			int count, int window) {
		return rankBranches(doCode, order, count, window, SUBMITTED_FIELD);
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
				matchStage(doCode, fromMonth, toMonth), group, project);

		List<DoAgingBucketModel> rows = mongoTemplate
				.aggregate(agg, MonthWiseReportEntity.class, DoAgingBucketModel.class)
				.getMappedResults();

		return rows.isEmpty() ? zeroFilledBuckets(doCode) : rows.get(0);
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

	public List<BranchPerformanceModel> getBranchRatio(String doCode, String order,
			int count, int window) {
		validateParams(doCode, count, window);
		Sort.Direction direction = directionOf(order);

		LocalDate toMonth = LocalDate.now().withDayOfMonth(1);
		LocalDate fromMonth = toMonth.minusMonths(window - 1L);

		Aggregation agg = Aggregation.newAggregation(
				matchStage(doCode, fromMonth, toMonth),
				groupStage(),
				projectStage());

		List<BranchPerformanceModel> rows = new ArrayList<>(mongoTemplate
				.aggregate(agg, MonthWiseReportEntity.class, BranchPerformanceModel.class)
				.getMappedResults());

		rows.forEach(m -> m.setRatioPercent(computeRatioPercent(m)));

		Comparator<BranchPerformanceModel> cmp = Comparator.comparingDouble(
				m -> m.getRatioPercent() == null ? 0.0 : m.getRatioPercent());
		if (direction == Sort.Direction.DESC) {
			cmp = cmp.reversed();
		}
		rows.sort(cmp);

		return rows.size() > count ? new ArrayList<>(rows.subList(0, count)) : rows;
	}

	private List<BranchPerformanceModel> rankBranches(String doCode, String order,
			int count, int window, String sortField) {
		validateParams(doCode, count, window);
		Sort.Direction direction = directionOf(order);

		LocalDate toMonth = LocalDate.now().withDayOfMonth(1);
		LocalDate fromMonth = toMonth.minusMonths(window - 1L);

		Aggregation agg = Aggregation.newAggregation(
				matchStage(doCode, fromMonth, toMonth),
				groupStage(),
				projectStage(),
				Aggregation.sort(direction, sortField),
				Aggregation.limit(count));

		List<BranchPerformanceModel> rows = mongoTemplate
				.aggregate(agg, MonthWiseReportEntity.class, BranchPerformanceModel.class)
				.getMappedResults();

		rows.forEach(m -> m.setRatioPercent(computeRatioPercent(m)));
		return rows;
	}

	private static MatchOperation matchStage(String doCode, LocalDate fromMonth, LocalDate toMonth) {
		return Aggregation.match(new Criteria().andOperator(
				Criteria.where("doCode").is(doCode),
				Criteria.where("calMonth").gte(fromMonth).lte(toMonth)));
	}

	private static GroupOperation groupStage() {
		return Aggregation.group("branchCode")
				.first("branchName").as("branchName")
				.sum(PROCESSED_FIELD).as(PROCESSED_FIELD)
				.sum(PENDING_FIELD).as(PENDING_FIELD)
				.sum(SUBMITTED_FIELD).as(SUBMITTED_FIELD);
	}

	private static ProjectionOperation projectStage() {
		return Aggregation
				.project("branchName", PROCESSED_FIELD, PENDING_FIELD, SUBMITTED_FIELD)
				.and("_id").as("branchCode")
				.andExclude("_id");
	}

	private static double computeRatioPercent(BranchPerformanceModel m) {
		long processed = m.getProcessedDocuments() == null ? 0L : m.getProcessedDocuments();
		long pending = m.getPendingDocuments() == null ? 0L : m.getPendingDocuments();
		long total = processed + pending;
		if (total == 0) {
			return 0.0;
		}
		double raw = (processed * 100.0) / total;
		return Math.round(raw * 100.0) / 100.0;
	}

	private static void validateParams(String doCode, int count, int window) {
		if (doCode == null || doCode.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "doCode is required");
		}
		if (count <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "count must be positive");
		}
		if (window <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "window must be positive");
		}
	}

	private static Sort.Direction directionOf(String order) {
		return "bottom".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
	}
}
