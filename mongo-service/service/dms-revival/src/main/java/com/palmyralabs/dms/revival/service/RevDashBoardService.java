package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.entity.DailyBranchWiseReportEntity;
import com.palmyralabs.dms.revival.entity.DailyBranchWiseReportEntity.PerApprover;
import com.palmyralabs.dms.revival.entity.MonthWiseReportEntity;
import com.palmyralabs.dms.revival.model.ResponseModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevDashBoardService {

	private static final String WEEKLY_COLLECTION = "active_cases_weekly_branchwise";

	private final MongoTemplate mongoTemplate;

	public List<ResponseModel> getMonthlyDocumentSummary(String divisionName, String branchName) {
		Query monthlyQuery = baseFilter(divisionName, branchName);
		List<MonthWiseReportEntity> monthlyList = mongoTemplate.find(monthlyQuery, MonthWiseReportEntity.class);

		long total = 0;
		long approved = 0;
		long pending = 0;
		long rejected = 0;

		for (MonthWiseReportEntity data : monthlyList) {
			total += nvl(data.getTotalDocuments());
			approved += nvl(data.getApprovedDocuments());
			pending += nvl(data.getPendingDocuments());
			rejected += nvl(data.getRejectedDocuments());
		}

		long todayDocuments = computeTodayDocuments(divisionName, branchName);
		return buildResponse(total, approved, pending, rejected, todayDocuments);
	}

	public List<ResponseModel> getWeeklyDocumentSummary(String divisionName, String branchName) {
		Query q = baseFilter(divisionName, branchName);
		List<DailyBranchWiseReportEntity> list = mongoTemplate.find(q, DailyBranchWiseReportEntity.class,
				WEEKLY_COLLECTION);
		return summarizeActiveCases(list, divisionName, branchName);
	}

	public List<ResponseModel> getDailyDocumentSummary(String divisionName, String branchName) {
		Query q = baseFilter(divisionName, branchName);
		List<DailyBranchWiseReportEntity> list = mongoTemplate.find(q, DailyBranchWiseReportEntity.class);
		return summarizeActiveCases(list, divisionName, branchName);
	}

	private List<ResponseModel> summarizeActiveCases(List<DailyBranchWiseReportEntity> list,
			String divisionName, String branchName) {
		long approved = 0;
		long pending = 0;
		long rejected = 0;

		for (DailyBranchWiseReportEntity doc : list) {
			pending += nvl(doc.getPendingDocuments());
			if (doc.getPerApprover() != null) {
				for (PerApprover pa : doc.getPerApprover()) {
					approved += nvl(pa.getAccepted());
					rejected += nvl(pa.getRejected());
				}
			}
		}

		long total = approved + pending + rejected;
		long todayDocuments = computeTodayDocuments(divisionName, branchName);
		return buildResponse(total, approved, pending, rejected, todayDocuments);
	}

	private long computeTodayDocuments(String divisionName, String branchName) {
		String today = LocalDate.now().toString();
		Query q = baseFilter(divisionName, branchName);
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

	private Query baseFilter(String divisionName, String branchName) {
		Query q = new Query();
		if (divisionName != null && !divisionName.isBlank()) {
			q.addCriteria(Criteria.where("divisionName").regex("^" + divisionName + "$", "i"));
		}
		if (branchName != null && !branchName.isBlank()) {
			q.addCriteria(Criteria.where("branchName").regex("^" + branchName + "$", "i"));
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

	private long nvl(Long v) {
		return v == null ? 0L : v;
	}
}
