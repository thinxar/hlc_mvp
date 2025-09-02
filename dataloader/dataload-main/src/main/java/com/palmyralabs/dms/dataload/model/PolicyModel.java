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

	private String customerId;

	private String customerName;

	private String customerDob;

	private String doc;

	private Long divisionCode;

	private String branchCode;

	private String batchNumber;

	private String boxNumber;

	private Integer rmsStatus;

	private String uploadLabel;

	private String mobileNumber;

	private Integer policyStatus;

}
