package com.palmyralabs.dms.revival.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TodayApprovalSummaryModel {

	private String groupBy;
	private String doCode;
	private String branchCode;
	private String branchName;
	private String approvedBy;
	private Long approvedDocuments;
	private Long pendingDocuments;
	private Long rejectedDocuments;
	private Long processedDocuments;
}
