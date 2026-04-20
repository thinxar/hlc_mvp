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
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.palmyralabs.dms.revival.entity.DailyBranchWiseReportEntity;
import com.palmyralabs.dms.revival.entity.DailyBranchWiseReportEntity.PerApprover;
import com.palmyralabs.dms.revival.entity.MonthWiseReportEntity;
import com.palmyralabs.dms.revival.entity.MonthlyActiveCasesEntity;
import com.palmyralabs.dms.revival.model.DailyDocumentSummaryModel;
import com.palmyralabs.dms.revival.model.MonthlyDocumentSummaryModel;
import com.palmyralabs.dms.revival.model.ResponseModel;
import com.palmyralabs.dms.revival.model.TodayApprovalSummaryModel;
import com.palmyralabs.dms.revival.model.WeeklyDocumentSummaryModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevDashBoardService {

	private static final String DAILY_COLLECTION = "active_cases_branchwise";
	private static final String WEEKLY_COLLECTION = "active_cases_weekly_branchwise";

	private static final int DAILY_MAX_INTERVAL_MONTHS = 2;
	private static final int WEEKLY_MAX_INTERVAL_MONTHS = 6;

	private final MongoTemplate mongoTemplate;

	public List<MonthlyDocumentSummaryModel> getMonthlyDocumentSummary(String doCode, String branchCode,
			LocalDate fromMonth, LocalDate toMonth) {
		MatchOperation match = Aggregation.match(monthlyMatch(doCode, branchCode, fromMonth, toMonth));

		GroupOperation group = Aggregation.group("month")
				.sum("approvedDocuments").as("approvedDocuments")
				.sum("pendingDocuments").as("pendingDocuments")
				.sum("rejectedDocuments").as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("approvedDocuments", "pendingDocuments", "rejectedDocuments")
				.and("_id").as("month")
				.andExpression("approvedDocuments + rejectedDocuments").as("processedDocuments")
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, "month");

		Aggregation agg = Aggregation.newAggregation(match, group, project, sort);
		return mongoTemplate
				.aggregate(agg, MonthWiseReportEntity.class, MonthlyDocumentSummaryModel.class)
				.getMappedResults();
	}

	public List<WeeklyDocumentSummaryModel> getWeeklyDocumentSummary(String doCode, String branchCode,
			LocalDate fromWeek, LocalDate toWeek) {
		LocalDate from = fromWeek == null ? null
				: fromWeek.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
		LocalDate to = toWeek == null ? null
				: toWeek.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
		assertMaxInterval(from, to, WEEKLY_MAX_INTERVAL_MONTHS, "weekly");
		return aggregateActiveCasesSummary(WEEKLY_COLLECTION, "cal_week",
				doCode, branchCode, from, to, WeeklyDocumentSummaryModel.class);
	}

	public List<DailyDocumentSummaryModel> getDailyDocumentSummary(String doCode, String branchCode,
			LocalDate fromDate, LocalDate toDate) {
		assertMaxInterval(fromDate, toDate, DAILY_MAX_INTERVAL_MONTHS, "daily");
		return aggregateActiveCasesSummary(DAILY_COLLECTION, "cal_date",
				doCode, branchCode, fromDate, toDate, DailyDocumentSummaryModel.class);
	}

	public List<TodayApprovalSummaryModel> getTodayApprovalSummary(LocalDate date,
			String zone, String division, String branch) {
		boolean hasZone = zone != null && !zone.isBlank();
		boolean hasDivision = division != null && !division.isBlank();
		boolean hasBranch = branch != null && !branch.isBlank();

		if (hasDivision && !hasZone) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"division filter requires zone");
		}
		if (hasBranch && !(hasZone && hasDivision)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"branch filter requires zone and division");
		}

		LocalDate queryDate = date != null ? date : LocalDate.now();

		if (hasBranch) {
			return aggregateTodayBySr(queryDate, zone, division, branch);
		}
		if (hasDivision) {
			return aggregateTodayByBranch(queryDate, zone, division);
		}
		if (hasZone) {
			return aggregateTodayByDivision(queryDate, zone);
		}
		return aggregateTodayByZone(queryDate);
	}

	private List<TodayApprovalSummaryModel> aggregateTodayByZone(LocalDate date) {
		MatchOperation match = Aggregation.match(Criteria.where("cal_date").is(date));

		GroupOperation group = Aggregation.group("Zone")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.accepted")).as("approvedDocuments")
				.sum("pendingDocuments").as("pendingDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.rejected")).as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("approvedDocuments", "pendingDocuments", "rejectedDocuments")
				.and("_id").as("zone")
				.andExpression("approvedDocuments + rejectedDocuments").as("processedDocuments")
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, "zone");

		Aggregation agg = Aggregation.newAggregation(match, group, project, sort);
		List<TodayApprovalSummaryModel> rows = mongoTemplate
				.aggregate(agg, DAILY_COLLECTION, TodayApprovalSummaryModel.class)
				.getMappedResults();
		rows.forEach(r -> r.setGroupBy("zone"));
		return rows;
	}

	private List<TodayApprovalSummaryModel> aggregateTodayByDivision(LocalDate date, String zone) {
		MatchOperation match = Aggregation.match(new Criteria().andOperator(
				Criteria.where("cal_date").is(date),
				Criteria.where("Zone").is(zone)));

		GroupOperation group = Aggregation.group("divisionName")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.accepted")).as("approvedDocuments")
				.sum("pendingDocuments").as("pendingDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.rejected")).as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("approvedDocuments", "pendingDocuments", "rejectedDocuments")
				.and("_id").as("division")
				.andExpression("approvedDocuments + rejectedDocuments").as("processedDocuments")
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, "division");

		Aggregation agg = Aggregation.newAggregation(match, group, project, sort);
		List<TodayApprovalSummaryModel> rows = mongoTemplate
				.aggregate(agg, DAILY_COLLECTION, TodayApprovalSummaryModel.class)
				.getMappedResults();
		rows.forEach(r -> {
			r.setGroupBy("division");
			r.setZone(zone);
		});
		return rows;
	}

	private List<TodayApprovalSummaryModel> aggregateTodayByBranch(LocalDate date,
			String zone, String division) {
		MatchOperation match = Aggregation.match(new Criteria().andOperator(
				Criteria.where("cal_date").is(date),
				Criteria.where("Zone").is(zone),
				Criteria.where("divisionName").is(division)));

		GroupOperation group = Aggregation.group("branchCode")
				.first("branchName").as("branchName")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.accepted")).as("approvedDocuments")
				.sum("pendingDocuments").as("pendingDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.rejected")).as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("approvedDocuments", "pendingDocuments", "rejectedDocuments", "branchName")
				.and("_id").as("branchCode")
				.andExpression("approvedDocuments + rejectedDocuments").as("processedDocuments")
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, "branchCode");

		Aggregation agg = Aggregation.newAggregation(match, group, project, sort);
		List<TodayApprovalSummaryModel> rows = mongoTemplate
				.aggregate(agg, DAILY_COLLECTION, TodayApprovalSummaryModel.class)
				.getMappedResults();
		rows.forEach(r -> {
			r.setGroupBy("branch");
			r.setZone(zone);
			r.setDivision(division);
		});
		return rows;
	}

	private List<TodayApprovalSummaryModel> aggregateTodayBySr(LocalDate date,
			String zone, String division, String branch) {
		MatchOperation match = Aggregation.match(new Criteria().andOperator(
				Criteria.where("cal_date").is(date),
				Criteria.where("Zone").is(zone),
				Criteria.where("divisionName").is(division),
				Criteria.where("branchCode").is(branch)));

		UnwindOperation unwind = Aggregation.unwind("perApprover");

		GroupOperation group = Aggregation.group("perApprover.approvedBy")
				.first("branchName").as("branchName")
				.sum("perApprover.accepted").as("approvedDocuments")
				.sum("perApprover.rejected").as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("approvedDocuments", "rejectedDocuments", "branchName")
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
			r.setZone(zone);
			r.setDivision(division);
			r.setBranchCode(branch);
			r.setPendingDocuments(0L);
		});
		return rows;
	}

	public List<ResponseModel> getMonthlyActiveCasesSummary(String doCode, String branchCode) {
		Query q = baseFilter(doCode, branchCode);
		List<MonthlyActiveCasesEntity> list = mongoTemplate.find(q, MonthlyActiveCasesEntity.class);

		long approved = 0;
		long pending = 0;
		long rejected = 0;

		for (MonthlyActiveCasesEntity doc : list) {
			pending += nvl(doc.getPendingDocuments());
			if (doc.getPerApprover() != null) {
				for (PerApprover pa : doc.getPerApprover()) {
					approved += nvl(pa.getAccepted());
					rejected += nvl(pa.getRejected());
				}
			}
		}

		long total = approved + pending + rejected;
		long todayDocuments = computeTodayDocuments(doCode, branchCode);
		return buildResponse(total, approved, pending, rejected, todayDocuments);
	}

	private <T> List<T> aggregateActiveCasesSummary(String collection, String timeField,
			String doCode, String branchCode, LocalDate from, LocalDate to, Class<T> modelClass) {
		MatchOperation match = Aggregation.match(bucketMatch(timeField, doCode, branchCode, from, to));

		GroupOperation group = Aggregation.group(timeField)
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.accepted")).as("approvedDocuments")
				.sum("pendingDocuments").as("pendingDocuments")
				.sum(AccumulatorOperators.Sum.sumOf("perApprover.rejected")).as("rejectedDocuments");

		ProjectionOperation project = Aggregation
				.project("approvedDocuments", "pendingDocuments", "rejectedDocuments")
				.and("_id").as(timeField)
				.andExpression("approvedDocuments + rejectedDocuments").as("processedDocuments")
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

	private Criteria monthlyMatch(String doCode, String branchCode, LocalDate fromMonth, LocalDate toMonth) {
		LocalDate from = fromMonth == null ? null : fromMonth.withDayOfMonth(1);
		LocalDate to = toMonth == null ? null : toMonth.withDayOfMonth(1);
		return bucketMatch("month", doCode, branchCode, from, to);
	}

	private long computeTodayDocuments(String doCode, String branchCode) {
		LocalDate today = LocalDate.now();
		Query q = baseFilter(doCode, branchCode);
		q.addCriteria(Criteria.where("cal_date").is(today));

		List<DailyBranchWiseReportEntity> list = mongoTemplate.find(q, DailyBranchWiseReportEntity.class);

		long sum = 0;
		for (DailyBranchWiseReportEntity data : list) {
			sum += nvl(data.getPendingDocuments())
					+ nvl(data.getSubmittedDocuments())
					+ nvl(data.getProcessedDocuments());
		}
		return sum;
	}

	private Query baseFilter(String doCode, String branchCode) {
		Query q = new Query();
		if (doCode != null && !doCode.isBlank()) {
			q.addCriteria(Criteria.where("doCode").is(doCode));
		}
		if (branchCode != null && !branchCode.isBlank()) {
			q.addCriteria(Criteria.where("branchCode").is(branchCode));
		}
		return q;
	}

	private List<ResponseModel> buildResponse(long total, long approved, long pending, long rejected,
			long todayDocuments) {
		List<ResponseModel> out = new ArrayList<>(5);
		out.add(new ResponseModel("total", total));
		out.add(new ResponseModel("approved", approved));
		out.add(new ResponseModel("pending", pending));
		out.add(new ResponseModel("rejected", rejected));
		out.add(new ResponseModel("todayDocuments", todayDocuments));
		return out;
	}

	private long nvl(Integer v) {
		return v == null ? 0L : v.longValue();
	}

	private static void assertMaxInterval(LocalDate from, LocalDate to, int maxMonths, String label) {
		if (from == null || to == null) return;
		if (to.isAfter(from.plusMonths(maxMonths))) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					String.format("%s interval exceeds %d months (from=%s, to=%s)",
							label, maxMonths, from, to));
		}
	}
}
