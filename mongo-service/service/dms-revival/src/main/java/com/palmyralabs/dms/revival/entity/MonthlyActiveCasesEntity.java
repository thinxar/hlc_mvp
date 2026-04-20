package com.palmyralabs.dms.revival.entity;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.revival.entity.DailyBranchWiseReportEntity.PerApprover;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "active_cases_monthly_branchwise")
public class MonthlyActiveCasesEntity {

	@Id
	private String id;
	private String branchCode;
	private String branchName;
	private String divisionName;
	private String doCode;
	private String zone;
	private LocalDate calMonth;

	private Integer pendingDocuments;
	private Integer submittedDocuments;
	private Integer processedDocuments;

	private List<PerApprover> perApprover;
}
