package com.palmyralabs.dms.revival.model;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DivisionPerformanceModel {

	private LocalDate calMonth;
	private String doCode;
	private String divisionName;
	private Long processedDocuments;
	private Long pendingDocuments;
	private Long submittedDocuments;
	private Double pendingPercentage;
	private Double processedPercentage;
}
