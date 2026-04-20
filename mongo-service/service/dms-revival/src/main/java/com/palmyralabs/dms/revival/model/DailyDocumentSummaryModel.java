package com.palmyralabs.dms.revival.model;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyDocumentSummaryModel {

	private LocalDate cal_date;
	private Long approvedDocuments;
	private Long pendingDocuments;
	private Long rejectedDocuments;
	private Long processedDocuments;
}
