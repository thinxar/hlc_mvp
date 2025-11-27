package com.palmyralabs.dms.model;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyModel {
	private Integer id;

	private Long policyNumber;

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

	private Long field1;

	private String field2;

	private String field3;

	private String mobileNumber;

	private Integer policyStatus;

}
