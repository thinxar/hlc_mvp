package com.palmyralabs.dms.revival.model;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApproverBreakdownModel {

	private String grain;
	private LocalDate fromBucket;
	private LocalDate toBucket;
	private Long processedDocuments;
	private List<PerApproverSummary> perApprover;
}
