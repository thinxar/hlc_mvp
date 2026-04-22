package com.palmyralabs.dms.revival.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.AccumulatorOperators;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.aggregation.UnwindOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.revival.model.ApproverSummaryModel;
import com.palmyralabs.dms.revival.model.DailyDocumentSummaryModel;
import com.palmyralabs.dms.revival.model.HeadlineSummaryModel;
import com.palmyralabs.dms.revival.model.MonthlyDocumentSummaryModel;
import com.palmyralabs.dms.revival.model.PerApproverSummary;
import com.palmyralabs.dms.revival.model.TodayApprovalSummaryModel;
import com.palmyralabs.dms.revival.model.WeeklyDocumentSummaryModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevDashBoardService {

	private static final String DAILY_COLLECTION = "active_cases_branchwise";
	private static final String WEEKLY_COLLECTION = "active_cases_weekly_branchwise";
	private static final String MONTHLY_COLLECTION = "active_cases_monthly_branchwise";

	private static final int DAILY_MAX_INTERVAL_MONTHS = 2;
	private static final int WEEKLY_MAX_INTERVAL_MONTHS = 6;

	private final MongoTemplate mongoTemplate;

	public List<WeeklyDocumentSummaryModel> getWeeklyDocumentSummary(String doCode, String branchCode,
			LocalDate fromWeek, LocalDate toWeek) {
		LocalDate from = fromWeek == null ? null
				: fromWeek.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
		LocalDate to = toWeek == null ? null
				: toWeek.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
		assertMaxInterval(from, to, WEEKLY_MAX_INTERVAL_MONTHS, "weekly");
		return aggregateActiveCasesSummary(WEEKLY_COLLECTION, "calWeek",
				doCode, branchCode, from, to, WeeklyDocumentSummaryModel.class);
	}

	public List<MonthlyDocumentSummaryModel> getMonthlyDocumentSummary(String zone, String doCode,
			String branchCode, LocalDate fromMonth, LocalDate toMonth) {
		LocalDate from = fromMonth == null ? null
				: fromMonth.with(TemporalAdjusters.firstDayOfMonth());
		LocalDate to = toMonth == null ? null
				: toMonth.with(TemporalAdjusters.firstDayOfMonth());

		List<Criteria> parts = new ArrayList<>();
		if (zone != null && !zone.isBlank()) parts.add(Criteria.where("zone").is(zone));
		if (doCode != null && !doCode.isBlank()) parts.add(Criteria.where("doCode").is(doCode));
		if (branchCode != null && !branchCode.isBlank()) parts.add(Criteria.where("branchCode").is(branchCode));
		if (from != null || to != null) {
			Criteria c = Criteria.where("calMonth");
			if (from != null) c.gte(from);
			if (to != null) c.lte(to);
			parts.add(c);
		}
		Criteria criteria = parts.isEmpty() ? new Criteria()
				: new Criteria().andOperator(parts.toArray(new Criteria[0]));

		MatchOperation match = Aggregation.match(criteria);

		GroupOperation group = Aggregation.group("calMonth")
				.first("zone").as("zone")
				.sum("pendingDocuments").as("pendingDocuments")
				.sum("submittedDocuments").as("submittedDocuments")
				.sum("processedDocuments").as("processedDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.accepted")).as("approvedDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.rejected")).as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("zone", "pendingDocuments", "submittedDocuments", "processedDocuments",
						"approvedDocuments", "rejectedDocuments")
				.and("_id").as("calMonth")
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, "calMonth");

		Aggregation agg = Aggregation.newAggregation(match, group, project, sort);
		return mongoTemplate
				.aggregate(agg, MONTHLY_COLLECTION, MonthlyDocumentSummaryModel.class)
				.getMappedResults();
	}

	public List<DailyDocumentSummaryModel> getDailyDocumentSummary(String doCode, String branchCode,
			LocalDate fromDate, LocalDate toDate) {
		assertMaxInterval(fromDate, toDate, DAILY_MAX_INTERVAL_MONTHS, "daily");
		return aggregateActiveCasesSummary(DAILY_COLLECTION, "calDate",
				doCode, branchCode, fromDate, toDate, DailyDocumentSummaryModel.class);
	}

	public PaginatedResponse<PerApproverSummary> getApproverBreakdown(String grain,
			LocalDate fromDate, LocalDate toDate, LocalDate date,
			String doCode, String branchCode, String srNumber,
			int limit, int offset, boolean includeTotal) {
		String g = grain == null || grain.isBlank() ? "daily" : grain.toLowerCase();

		String collection;
		String timeField;
		switch (g) {
			case "daily":
				collection = DAILY_COLLECTION;
				timeField = "calDate";
				break;
			case "weekly":
				collection = WEEKLY_COLLECTION;
				timeField = "calWeek";
				break;
			case "monthly":
				collection = MONTHLY_COLLECTION;
				timeField = "calMonth";
				break;
			default:
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"grain must be one of: daily, weekly, monthly");
		}

		if (date != null) {
			fromDate = date;
			toDate = date;
		}

		if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "fromDate after toDate");
		}

		List<PerApproverSummary> allApprovers = aggregateRangedApprovers(collection, timeField,
				fromDate, toDate, doCode, branchCode);

		if (srNumber != null && !srNumber.isBlank()) {
			String needle = srNumber.trim();
			List<PerApproverSummary> filtered = new ArrayList<>(allApprovers.size());
			for (PerApproverSummary a : allApprovers) {
				if (a.getApprovedBy() != null && a.getApprovedBy().contains(needle)) {
					filtered.add(a);
				}
			}
			allApprovers = filtered;
		}

		int fromIdx = Math.min(Math.max(0, offset), allApprovers.size());
		int toIdx = limit <= 0 ? allApprovers.size()
				: Math.min(fromIdx + limit, allApprovers.size());
		List<PerApproverSummary> paged = new ArrayList<>(allApprovers.subList(fromIdx, toIdx));

		long total = includeTotal ? allApprovers.size() : 0L;
		return new PaginatedResponse<>(paged, limit, offset, total);
	}

	public ApproverSummaryModel getApproverSummary(String grain,
			LocalDate fromDate, LocalDate toDate, LocalDate date,
			String doCode, String branchCode) {
		String g = grain == null || grain.isBlank() ? "daily" : grain.toLowerCase();

		String collection;
		String timeField;
		switch (g) {
			case "daily":
				collection = DAILY_COLLECTION;
				timeField = "calDate";
				break;
			case "weekly":
				collection = WEEKLY_COLLECTION;
				timeField = "calWeek";
				break;
			case "monthly":
				collection = MONTHLY_COLLECTION;
				timeField = "calMonth";
				break;
			default:
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"grain must be one of: daily, weekly, monthly");
		}

		if (date != null) {
			fromDate = date;
			toDate = date;
		}

		if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "fromDate after toDate");
		}

		List<PerApproverSummary> approvers = aggregateRangedApprovers(collection, timeField,
				fromDate, toDate, doCode, branchCode);

		long totalApproved = 0L;
		long totalRejected = 0L;
		for (PerApproverSummary a : approvers) {
			if (a.getApproved() != null) totalApproved += a.getApproved();
			if (a.getRejected() != null) totalRejected += a.getRejected();
		}

		ApproverSummaryModel out = new ApproverSummaryModel();
		out.setTotalApprovers((long) approvers.size());
		out.setTotalApproved(totalApproved);
		out.setTotalRejected(totalRejected);
		out.setTotalDocuments(totalApproved + totalRejected);
		return out;
	}

	private List<PerApproverSummary> aggregateRangedApprovers(String collection, String timeField,
			LocalDate from, LocalDate to, String doCode, String branchCode) {
		MatchOperation match = Aggregation.match(
				bucketMatch(timeField, doCode, branchCode, from, to));
		UnwindOperation unwind = Aggregation.unwind("perApprover");

		GroupOperation group = Aggregation.group("perApprover.approvedBy")
				.sum("perApprover.accepted").as("approved")
				.sum("perApprover.rejected").as("rejected");

		ProjectionOperation project = Aggregation
				.project("approved", "rejected")
				.and("_id").as("approvedBy")
				.andExpression("approved + rejected").as("processed")
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, "approvedBy");

		Aggregation agg = Aggregation.newAggregation(match, unwind, group, project, sort);
		return mongoTemplate
				.aggregate(agg, collection, PerApproverSummary.class)
				.getMappedResults();
	}

	public List<TodayApprovalSummaryModel> getTodayApprovalSummary(LocalDate date,
			String doCode, String branchCode) {
		boolean hasDoCode = doCode != null && !doCode.isBlank();
		boolean hasBranchCode = branchCode != null && !branchCode.isBlank();

		LocalDate queryDate = date != null ? date : LocalDate.now();

		if (hasBranchCode) {
			return aggregateTodayBySr(queryDate, branchCode);
		}
		if (hasDoCode) {
			return aggregateTodayByBranch(queryDate, doCode);
		}
		return aggregateTodayByDoCode(queryDate);
	}

	private List<TodayApprovalSummaryModel> aggregateTodayByDoCode(LocalDate date) {
		MatchOperation match = Aggregation.match(Criteria.where("calDate").gte(date).lte(date));

		GroupOperation group = Aggregation.group("doCode")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.accepted")).as("approvedDocuments")
				.sum("pendingDocuments").as("pendingDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.rejected")).as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("approvedDocuments", "pendingDocuments", "rejectedDocuments")
				.and("_id").as("doCode")
				.andExpression("approvedDocuments + rejectedDocuments").as("processedDocuments")
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, "doCode");

		Aggregation agg = Aggregation.newAggregation(match, group, project, sort);
		List<TodayApprovalSummaryModel> rows = mongoTemplate
				.aggregate(agg, DAILY_COLLECTION, TodayApprovalSummaryModel.class)
				.getMappedResults();
		rows.forEach(r -> r.setGroupBy("doCode"));
		return rows;
	}

	private List<TodayApprovalSummaryModel> aggregateTodayByBranch(LocalDate date, String doCode) {
		MatchOperation match = Aggregation.match(new Criteria().andOperator(
				Criteria.where("calDate").gte(date).lte(date),
				Criteria.where("doCode").is(doCode)));

		GroupOperation group = Aggregation.group("branchCode")
				.first("branchName").as("branchName")
				.first("doCode").as("doCode")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.accepted")).as("approvedDocuments")
				.sum("pendingDocuments").as("pendingDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.rejected")).as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("approvedDocuments", "pendingDocuments", "rejectedDocuments",
						"branchName", "doCode")
				.and("_id").as("branchCode")
				.andExpression("approvedDocuments + rejectedDocuments").as("processedDocuments")
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, "branchCode");

		Aggregation agg = Aggregation.newAggregation(match, group, project, sort);
		List<TodayApprovalSummaryModel> rows = mongoTemplate
				.aggregate(agg, DAILY_COLLECTION, TodayApprovalSummaryModel.class)
				.getMappedResults();
		rows.forEach(r -> r.setGroupBy("branchCode"));
		return rows;
	}

	private List<TodayApprovalSummaryModel> aggregateTodayBySr(LocalDate date, String branchCode) {
		MatchOperation match = Aggregation.match(new Criteria().andOperator(
				Criteria.where("calDate").gte(date).lte(date),
				Criteria.where("branchCode").is(branchCode)));

		UnwindOperation unwind = Aggregation.unwind("perApprover");

		GroupOperation group = Aggregation.group("perApprover.approvedBy")
				.first("branchName").as("branchName")
				.first("doCode").as("doCode")
				.sum("perApprover.accepted").as("approvedDocuments")
				.sum("perApprover.rejected").as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("approvedDocuments", "rejectedDocuments", "branchName", "doCode")
				.and("_id").as("approvedBy")
				.andExpression("approvedDocuments + rejectedDocuments").as("processedDocuments")
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, "approvedBy");

		Aggregation agg = Aggregation.newAggregation(match, unwind, group, project, sort);
		List<TodayApprovalSummaryModel> rows = mongoTemplate
				.aggregate(agg, DAILY_COLLECTION, TodayApprovalSummaryModel.class)
				.getMappedResults();
		rows.forEach(r -> {
			r.setGroupBy("sr");
			r.setBranchCode(branchCode);
			r.setPendingDocuments(0L);
		});
		return rows;
	}

	private <T> List<T> aggregateActiveCasesSummary(String collection, String timeField,
			String doCode, String branchCode, LocalDate from, LocalDate to, Class<T> modelClass) {
		MatchOperation match = Aggregation.match(bucketMatch(timeField, doCode, branchCode, from, to));

		GroupOperation group = Aggregation.group(timeField)
				.sum("pendingDocuments").as("pendingDocuments")
				.sum("submittedDocuments").as("submittedDocuments")
				.sum("processedDocuments").as("processedDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.accepted")).as("approvedDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.rejected")).as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("pendingDocuments", "submittedDocuments", "processedDocuments",
						"approvedDocuments", "rejectedDocuments")
				.and("_id").as(timeField)
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, timeField);

		Aggregation agg = Aggregation.newAggregation(match, group, project, sort);
		return mongoTemplate.aggregate(agg, collection, modelClass).getMappedResults();
	}

	private Criteria bucketMatch(String timeField, String doCode, String branchCode,
			LocalDate from, LocalDate to) {
		List<Criteria> parts = new ArrayList<>();
		if (doCode != null && !doCode.isBlank()) {
			parts.add(Criteria.where("doCode").is(doCode));
		}
		if (branchCode != null && !branchCode.isBlank()) {
			parts.add(Criteria.where("branchCode").is(branchCode));
		}
		if (from != null || to != null) {
			Criteria c = Criteria.where(timeField);
			if (from != null) c.gte(from);
			if (to != null) c.lte(to);
			parts.add(c);
		}
		return parts.isEmpty() ? new Criteria() : new Criteria().andOperator(parts.toArray(new Criteria[0]));
	}

	private static void assertMaxInterval(LocalDate from, LocalDate to, int maxMonths, String label) {
		if (from == null || to == null) return;
		if (to.isAfter(from.plusMonths(maxMonths))) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					String.format("%s interval exceeds %d months (from=%s, to=%s)",
							label, maxMonths, from, to));
		}
	}
	
	public HeadlineSummaryModel getHeadlineSummary(LocalDate fromMonth, LocalDate toMonth,
			LocalDate date, String doCode, String branchCode) {
		LocalDate fromM = fromMonth != null ? fromMonth.withDayOfMonth(1) : null;
		LocalDate toM = toMonth != null ? toMonth.withDayOfMonth(1) : null;
		LocalDate nowFirst = LocalDate.now().withDayOfMonth(1);
		if (fromM == null && toM == null) {
			fromM = nowFirst.minusMonths(5);
			toM = nowFirst;
		} else if (fromM == null) {
			fromM = toM.minusMonths(5);
		} else if (toM == null) {
			toM = nowFirst;
		}
		if (fromM.isAfter(toM)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "fromMonth after toMonth");
		}

		LocalDate queryDate = date != null ? date : LocalDate.now();

		HeadlineSummaryModel out = aggregateHeadlineMonthly(fromM, toM, doCode, branchCode);
		out.setTodayProcessed(aggregateHeadlineTodayProcessed(queryDate, doCode, branchCode));
		return out;
	}

	private HeadlineSummaryModel aggregateHeadlineMonthly(LocalDate from, LocalDate to,
			String doCode, String branchCode) {
		MatchOperation match = Aggregation.match(
				bucketMatch("calMonth", doCode, branchCode, from, to));

		GroupOperation group = Aggregation.group()
				.sum("pendingDocuments").as("pendingDocuments")
				.sum("submittedDocuments").as("submittedDocuments")
				.sum("processedDocuments").as("processedDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.accepted")).as("approvedDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.rejected")).as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("pendingDocuments", "submittedDocuments", "processedDocuments",
						"approvedDocuments", "rejectedDocuments")
				.andExpression("pendingDocuments + processedDocuments")
				.as("totalDocuments")
				.andExclude("_id");

		Aggregation agg = Aggregation.newAggregation(match, group, project);
		List<HeadlineSummaryModel> results = mongoTemplate
				.aggregate(agg, MONTHLY_COLLECTION, HeadlineSummaryModel.class)
				.getMappedResults();

		HeadlineSummaryModel out = results.isEmpty() ? new HeadlineSummaryModel() : results.get(0);
		if (out.getTotalDocuments() == null) out.setTotalDocuments(0L);
		if (out.getPendingDocuments() == null) out.setPendingDocuments(0L);
		if (out.getSubmittedDocuments() == null) out.setSubmittedDocuments(0L);
		if (out.getProcessedDocuments() == null) out.setProcessedDocuments(0L);
		if (out.getApprovedDocuments() == null) out.setApprovedDocuments(0L);
		if (out.getRejectedDocuments() == null) out.setRejectedDocuments(0L);
		return out;
	}

	private HeadlineSummaryModel.TodayProcessed aggregateHeadlineTodayProcessed(LocalDate date,
			String doCode, String branchCode) {
		MatchOperation match = Aggregation.match(
				bucketMatch("calDate", doCode, branchCode, date, date));

		GroupOperation group = Aggregation.group()
				.sum("processedDocuments").as("totalProcessed")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.accepted")).as("approved")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.rejected")).as("rejected");

		ProjectionOperation project = Aggregation
				.project("totalProcessed", "approved", "rejected")
				.andExclude("_id");

		Aggregation agg = Aggregation.newAggregation(match, group, project);
		List<HeadlineSummaryModel.TodayProcessed> results = mongoTemplate
				.aggregate(agg, DAILY_COLLECTION, HeadlineSummaryModel.TodayProcessed.class)
				.getMappedResults();

		HeadlineSummaryModel.TodayProcessed out = results.isEmpty()
				? new HeadlineSummaryModel.TodayProcessed()
				: results.get(0);
		if (out.getTotalProcessed() == null) out.setTotalProcessed(0L);
		if (out.getApproved() == null) out.setApproved(0L);
		if (out.getRejected() == null) out.setRejected(0L);
		return out;
	}

}
