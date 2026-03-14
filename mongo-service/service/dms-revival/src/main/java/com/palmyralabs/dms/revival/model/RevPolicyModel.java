package com.palmyralabs.dms.revival.model;

import java.time.LocalDate;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RevPolicyModel {
	@AutoIncrementId
	private Integer id;

	private Long policyNumber;

	private String docType;

	private String docSubType;

	private String srNo;

	private String asrNo;

	private String soCode;

	private String doCode;

	private LocalDate dateOfSubmission;

	private String uploadedBy;

	private String boCode;
}
