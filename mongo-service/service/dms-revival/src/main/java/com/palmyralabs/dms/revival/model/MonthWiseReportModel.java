package com.palmyralabs.dms.revival.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonthWiseReportModel {
	
	private String id;
	private String month;
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
