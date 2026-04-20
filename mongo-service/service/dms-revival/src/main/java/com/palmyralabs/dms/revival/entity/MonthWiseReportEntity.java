package com.palmyralabs.dms.revival.entity;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "monthly_branchwise_report")
public class MonthWiseReportEntity {

	@Id
	private String id;
	private LocalDate month;
	private String zone;
	private String divisionName;
	private String doCode;
	private String branchCode;
	private String branchName;
	private String no_cases;
	private Long totalDocuments;
	private Long approvedDocuments;
	private Long pendingDocuments;
	private Long rejectedDocuments;
}