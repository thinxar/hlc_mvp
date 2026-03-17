package com.palmyralabs.dms.dataload.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.palmyralabs.palmyra.client.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType("policy")
public class PolicyModel {
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Integer id;

	private Integer policyNumber;

	private String docType;

	private String docSubType;

	private String srNo;

	private String asrNo;

	private String soCode;

	private String doCode;

	private String dateOfSubmission;

	private String uploadedBy;

	private String boCode;

}
