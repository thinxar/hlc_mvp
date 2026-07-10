package com.palmyralabs.dms.revival.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HeadlineSummaryModel {

	private Long totalDocuments;
	private Long pendingDocuments;
	private Long submittedDocuments;
	private Long processedDocuments;
	private Long approvedDocuments;
	private Long rejectedDocuments;
	private TodayProcessed todayProcessed;

	@Getter
	@Setter
	public static class TodayProcessed {

		private Long totalProcessed;
		private Long approved;
		private Long rejected;
	}
}
