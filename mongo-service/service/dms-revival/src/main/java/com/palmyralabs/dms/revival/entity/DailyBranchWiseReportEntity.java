package com.palmyralabs.dms.revival.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "monthly_branchwise_report")
public class DailyBranchWiseReportEntity {

	@Id
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
