package com.palmyralabs.dms.revival.model;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeeklyDocumentSummaryModel {

	private LocalDate calWeek;
	private Long processedDocuments;
	private Long approvedDocuments;
	private Long rejectedDocuments;
	private Long pendingDocuments;
	private Long submittedDocuments;
}
