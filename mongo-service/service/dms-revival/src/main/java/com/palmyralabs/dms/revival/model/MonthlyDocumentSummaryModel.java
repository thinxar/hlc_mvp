package com.palmyralabs.dms.revival.model;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonthlyDocumentSummaryModel {

	private LocalDate calMonth;
	private Long approvedDocuments;
	private Long pendingDocuments;
	private Long rejectedDocuments;
	private Long processedDocuments;
}
