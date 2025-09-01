package com.palmyralabs.dms.dataload.model;

import java.time.LocalDate;

import com.palmyralabs.palmyra.client.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType("policy")
public class PolicyModel {
	private Integer id;

	private Integer policyNumber;

	private String customerId;

	private String customerName;

	private LocalDate customerDob;

	private LocalDate doc;

	private Long divisionCode;

	private String branchCode;

	private String batchNumber;

	private String boxNumber;

	private Integer rmsStatus;

	private String uploadLabel;

	private String mobileNumber;

	private Integer policyStatus;

}
