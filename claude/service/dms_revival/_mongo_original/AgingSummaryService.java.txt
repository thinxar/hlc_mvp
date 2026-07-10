package com.palmyralabs.dms.revival.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
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

import com.palmyralabs.dms.revival.model.AgingSummaryModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgingSummaryService {

	private static final String DAILY_COLLECTION = "active_cases_branchwise";
	private static final String WEEKLY_COLLECTION = "active_cases_weekly_branchwise";
	private static final String MONTHLY_COLLECTION = "active_cases_monthly_branchwise";

	private static final String[] BAND_FIELDS = {
			"ageingSummary.d0_5", "ageingSummary.d6_10", "ageingSummary.d11_20",
			"ageingSummary.d21_30", "ageingSummary.d31_45", "ageingSummary.d45plus"
	};

	private final MongoTemplate mongoTemplate;

	public List<AgingSummaryModel> getMonthlyAgingSummary(String doCode, String branchCode,
			LocalDate fromMonth, LocalDate toMonth) {
		LocalDate from = fromMonth == null ? null : fromMonth.with(TemporalAdjusters.firstDayOfMonth());
		LocalDate to = toMonth == null ? null : toMonth.with(TemporalAdjusters.firstDayOfMonth());
		return aggregate(MONTHLY_COLLECTION, "calMonth", doCode, branchCode, from, to);
	}

	public List<AgingSummaryModel> getWeeklyAgingSummary(String doCode, String branchCode,
			LocalDate fromWeek, LocalDate toWeek) {
		LocalDate from = fromWeek == null ? null
				: fromWeek.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
		LocalDate to = toWeek == null ? null
				: toWeek.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
		assertMaxInterval(from, to, 6, "weekly");
		return aggregate(WEEKLY_COLLECTION, "calWeek", doCode, branchCode, from, to);
	}

	public List<AgingSummaryModel> getDailyAgingSummary(String doCode, String branchCode,
			LocalDate fromDate, LocalDate toDate) {
		assertMaxInterval(fromDate, toDate, 2, "daily");
		return aggregate(DAILY_COLLECTION, "calDate", doCode, branchCode, fromDate, toDate);
	}

	private List<AgingSummaryModel> aggregate(String collection, String timeField,
			String doCode, String branchCode, LocalDate from, LocalDate to) {
		MatchOperation match = Aggregation.match(bucketMatch(timeField, doCode, branchCode, from, to));

		GroupOperation group = Aggregation.group(timeField)
				.sum("pendingDocuments").as("pendingDocuments")
				.sum(BAND_FIELDS[0]).as("d0_5")
				.sum(BAND_FIELDS[1]).as("d6_10")
				.sum(BAND_FIELDS[2]).as("d11_20")
				.sum(BAND_FIELDS[3]).as("d21_30")
				.sum(BAND_FIELDS[4]).as("d31_45")
				.sum(BAND_FIELDS[5]).as("d45plus");

		ProjectionOperation project = Aggregation
				.project("pendingDocuments", "d0_5", "d6_10", "d11_20", "d21_30", "d31_45", "d45plus")
				.and("_id").as(timeField)
				.andExclude("_id");

		SortOperation sort = Aggregation.sort(Sort.Direction.ASC, timeField);

		Aggregation agg = Aggregation.newAggregation(match, group, project, sort);
		return mongoTemplate.aggregate(agg, collection, AgingSummaryModel.class).getMappedResults();
	}

	private Criteria bucketMatch(String timeField, String doCode, String branchCode,
			LocalDate from, LocalDate to) {
		List<Criteria> parts = new ArrayList<>();
		if (doCode != null && !doCode.isBlank())
			parts.add(Criteria.where("doCode").is(doCode));
		if (branchCode != null && !branchCode.isBlank())
			parts.add(Criteria.where("branchCode").is(branchCode));
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
					String.format("%s interval exceeds %d months", label, maxMonths));
		}
	}
}
