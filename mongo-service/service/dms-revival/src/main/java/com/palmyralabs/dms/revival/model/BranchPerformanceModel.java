package com.palmyralabs.dms.revival.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BranchPerformanceModel {

	private String branchCode;
	private String branchName;
	private Long processedDocuments;
	private Long pendingDocuments;
	private Long submittedDocuments;
	private Double ratioPercent;
}
