package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.entity.DailyBranchWiseReportEntity;
import com.palmyralabs.dms.revival.entity.MonthWiseReportEntity;
import com.palmyralabs.dms.revival.model.ResponseModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevDashBoardService {

	private final MongoTemplate mongoTemplate;

	public List<ResponseModel> getDocumentSummary(String divisionName, String branchName) {
		Query monthlyQuery = new Query();
		if (divisionName != null && !divisionName.isBlank()) {
			monthlyQuery.addCriteria(Criteria.where("divisionName").regex("^" + divisionName + "$", "i"));
		}
		if (branchName != null && !branchName.isBlank()) {
			monthlyQuery.addCriteria(Criteria.where("branchName").regex("^" + branchName + "$", "i"));
		}
		List<MonthWiseReportEntity> monthlyList = mongoTemplate.find(monthlyQuery, MonthWiseReportEntity.class);

		long total = 0;
		long approved = 0;
		long pending = 0;
		long rejected = 0;

		for (MonthWiseReportEntity data : monthlyList) {
			total += data.getTotalDocuments();
			approved += data.getApprovedDocuments();
			pending += data.getPendingDocuments();
			rejected += data.getRejectedDocuments();
		}

		String today = LocalDate.now().toString();

		Query dailyQuery = new Query();
		dailyQuery.addCriteria(Criteria.where("cal_date").is(today));

		if (divisionName != null && !divisionName.isBlank()) {
			dailyQuery.addCriteria(Criteria.where("divisionName").regex("^" + divisionName + "$", "i"));
		}

		if (branchName != null && !branchName.isBlank()) {
			dailyQuery.addCriteria(Criteria.where("branchName").regex("^" + branchName + "$", "i"));
		}

		List<DailyBranchWiseReportEntity> dailyList = mongoTemplate.find(dailyQuery, DailyBranchWiseReportEntity.class);

		long todayDocuments = 0;

		for (DailyBranchWiseReportEntity data : dailyList) {
			todayDocuments += data.getPendingDocuments() + data.getSubmittedDocuments() + data.getProcessedDocuments();
		}

		List<ResponseModel> response = new ArrayList<>();

		response.add(new ResponseModel("total", total));
		response.add(new ResponseModel("approved", approved));
		response.add(new ResponseModel("pending", pending));
		response.add(new ResponseModel("rejected", rejected));
		response.add(new ResponseModel("todayDocuments", todayDocuments));

		return response;
	}
}