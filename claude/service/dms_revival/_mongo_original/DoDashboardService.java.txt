package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.ToDoubleFunction;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.palmyralabs.dms.revival.entity.MonthWiseReportEntity;
import com.palmyralabs.dms.revival.model.BranchPerformanceModel;

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

	public List<BranchPerformanceModel> listBranches(String doCode, int limit,
			String orderBy, int window) {
		if (doCode == null || doCode.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "doCode is required");
		}
		if (limit != -1 && limit <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"limit must be -1 (no cap) or a positive integer");
		}
		if (window <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "window must be positive");
		}

		String sortField;
		Sort.Direction direction;
		String key = (orderBy == null || orderBy.isBlank()) ? "branchName" : orderBy;
		switch (key) {
			case "branchName":
				sortField = "branchName";
				direction = Sort.Direction.ASC;
				break;
			case "processed":
				sortField = PROCESSED_FIELD;
				direction = Sort.Direction.DESC;
				break;
			case "submitted":
				sortField = SUBMITTED_FIELD;
				direction = Sort.Direction.DESC;
				break;
			case "pending":
				sortField = PENDING_FIELD;
				direction = Sort.Direction.DESC;
				break;
			default:
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"orderBy must be one of: branchName, processed, submitted, pending");
		}

		LocalDate toMonth = LocalDate.now().withDayOfMonth(1);
		LocalDate fromMonth = toMonth.minusMonths(window - 1L);

		List<AggregationOperation> stages = new ArrayList<>();
		stages.add(DoAggregationUtils.matchStage(doCode, fromMonth, toMonth));
		stages.add(groupStage());
		stages.add(projectStage());
		stages.add(Aggregation.sort(direction, sortField));
		if (limit > 0) {
			stages.add(Aggregation.limit(limit));
		}

		List<BranchPerformanceModel> rows = mongoTemplate
				.aggregate(Aggregation.newAggregation(stages),
						MonthWiseReportEntity.class, BranchPerformanceModel.class)
				.getMappedResults();

		rows.forEach(m -> m.setRatioPercent(computeProcessedRatioPercent(m)));
		return rows;
	}

	public List<BranchPerformanceModel> getBranchPendingRatio(String doCode, String order,
			int count, int window) {
		return rankBranchesByRatio(doCode, order, count, window,
				DoDashboardService::computePendingRatioPercent);
	}

	public List<BranchPerformanceModel> getBranchProcessedRatio(String doCode, String order,
			int count, int window) {
		return rankBranchesByRatio(doCode, order, count, window,
				DoDashboardService::computeProcessedRatioPercent);
	}

	private List<BranchPerformanceModel> rankBranchesByRatio(String doCode, String order,
			int count, int window, ToDoubleFunction<BranchPerformanceModel> ratioFn) {
		validateParams(doCode, count, window);
		Sort.Direction direction = directionOf(order);

		LocalDate toMonth = LocalDate.now().withDayOfMonth(1);
		LocalDate fromMonth = toMonth.minusMonths(window - 1L);

		Aggregation agg = Aggregation.newAggregation(
				DoAggregationUtils.matchStage(doCode, fromMonth, toMonth),
				groupStage(),
				projectStage());

		List<BranchPerformanceModel> rows = new ArrayList<>(mongoTemplate
				.aggregate(agg, MonthWiseReportEntity.class, BranchPerformanceModel.class)
				.getMappedResults());

		rows.forEach(m -> m.setRatioPercent(ratioFn.applyAsDouble(m)));

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
				DoAggregationUtils.matchStage(doCode, fromMonth, toMonth),
				groupStage(),
				projectStage(),
				Aggregation.sort(direction, sortField),
				Aggregation.limit(count));

		List<BranchPerformanceModel> rows = mongoTemplate
				.aggregate(agg, MonthWiseReportEntity.class, BranchPerformanceModel.class)
				.getMappedResults();

		rows.forEach(m -> m.setRatioPercent(computeProcessedRatioPercent(m)));
		return rows;
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

	private static double computeProcessedRatioPercent(BranchPerformanceModel m) {
		long processed = m.getProcessedDocuments() == null ? 0L : m.getProcessedDocuments();
		long pending = m.getPendingDocuments() == null ? 0L : m.getPendingDocuments();
		long total = processed + pending;
		return total == 0 ? 0.0 : DoAggregationUtils.round2(processed * 100.0 / total);
	}

	private static double computePendingRatioPercent(BranchPerformanceModel m) {
		long processed = m.getProcessedDocuments() == null ? 0L : m.getProcessedDocuments();
		long pending = m.getPendingDocuments() == null ? 0L : m.getPendingDocuments();
		long total = processed + pending;
		return total == 0 ? 0.0 : DoAggregationUtils.round2(pending * 100.0 / total);
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
