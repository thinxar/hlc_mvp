package com.palmyralabs.dms.revival.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rev_active_cases_branchwise")
public class DailyBranchWiseReportEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "branch_code")
	private String branchCode;

	@Column(name = "branch_name")
	private String branchName;

	@Column(name = "division_name")
	private String divisionName;

	@Column(name = "do_code")
	private String doCode;

	@Column(name = "zone")
	private String zone;

	@Column(name = "cal_date")
	private LocalDate calDate;

	@Column(name = "pending_documents")
	private Integer pendingDocuments;

	@Column(name = "submitted_documents")
	private Integer submittedDocuments;

	@Column(name = "processed_documents")
	private Integer processedDocuments;

	@Convert(converter = PerApproverListConverter.class)
	@Column(name = "per_approver", columnDefinition = "text")
	private List<PerApprover> perApprover;

	@Getter
	@Setter
	public static class PerApprover {

		private String approvedBy;
		private Integer accepted;
		private Integer rejected;
	}
}
