package com.palmyralabs.dms.revival.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PerApproverSummary {

	private String approvedBy;
	private Long approvedCount;
	private Long rejectedCount;
}
