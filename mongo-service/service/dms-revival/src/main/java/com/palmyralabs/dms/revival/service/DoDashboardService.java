package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.query.Criteria;
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
	private static final String COUNT_ALIAS = "count";

	private final MongoTemplate mongoTemplate;

	public List<BranchPerformanceModel> getBranchProcessed(String doCode, String order,
			int count, int window) {
		return rankBranches(doCode, order, count, window, PROCESSED_FIELD);
	}

	public List<BranchPerformanceModel> getBranchPending(String doCode, String order,
			int count, int window) {
		return rankBranches(doCode, order, count, window, PENDING_FIELD);
	}

	private List<BranchPerformanceModel> rankBranches(String doCode, String order,
			int count, int window, String sumField) {
		if (doCode == null || doCode.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "doCode is required");
		}
		if (count <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "count must be positive");
		}
		if (window <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "window must be positive");
		}

		Sort.Direction direction = "top".equalsIgnoreCase(order)
				? Sort.Direction.DESC : Sort.Direction.ASC;

		LocalDate toMonth = LocalDate.now().withDayOfMonth(1);
		LocalDate fromMonth = toMonth.minusMonths(window - 1L);

		MatchOperation match = Aggregation.match(new Criteria().andOperator(
				Criteria.where("doCode").is(doCode),
				Criteria.where("calMonth").gte(fromMonth).lte(toMonth)));

		GroupOperation group = Aggregation.group("branchCode")
				.first("branchName").as("branchName")
				.sum(sumField).as(COUNT_ALIAS);

		ProjectionOperation project = Aggregation
				.project("branchName", COUNT_ALIAS)
				.and("_id").as("branchCode")
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(direction, COUNT_ALIAS);

		Aggregation agg = Aggregation.newAggregation(
				match, group, project, sort, Aggregation.limit(count));

		return mongoTemplate
				.aggregate(agg, MonthWiseReportEntity.class, BranchPerformanceModel.class)
				.getMappedResults();
	}
}
