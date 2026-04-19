package com.palmyralabs.dms.revival.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyBranchWiseReportModel {

	private String id;
	private String branchCode;
	private String branchName;
	private String divisionName;
	private String doCode;
	private String Zone;
	private String cal_date;

	private Integer pendingDocuments;
	private Integer submittedDocuments;
	private Integer processedDocuments;

	private List<PerApprover> perApprover;
}

@Getter
@Setter
class PerApprover {

	private String approvedBy;
	private Integer accepted;
	private Integer rejected;
}
