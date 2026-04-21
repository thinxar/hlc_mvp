package com.palmyralabs.dms.revival.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApproverSummaryModel {

	private Long totalApprovers;
	private Long totalDocuments;
	private Long totalApproved;
	private Long totalRejected;
}
