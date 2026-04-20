package com.palmyralabs.dms.revival.entity;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "active_cases_monthly_branchwise")
public class MonthWiseReportEntity {

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

	@Getter
	@Setter
	public static class PerApprover {

		private String approvedBy;
		private Integer accepted;
		private Integer rejected;
	}
}