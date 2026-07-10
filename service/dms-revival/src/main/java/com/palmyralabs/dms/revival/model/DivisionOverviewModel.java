package com.palmyralabs.dms.revival.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DivisionOverviewModel {

	private Long totalBranches;
	private Long totalCases;
	private Long submittedDocuments;
	private Long processedDocuments;
	private Long pendingDocuments;
}
