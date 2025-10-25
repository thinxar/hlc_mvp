package com.palmyralabs.dms.model;

import java.time.LocalDate;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;
import com.palmyralabs.palmyra.base.format.Mandatory;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "DmsPolicy")
public class PolicyModel {
	@PalmyraField(primaryKey = true)
	private Integer id;

	@PalmyraField(mandatory = Mandatory.ALL)
	private Integer policyNumber;

	@PalmyraField
	private String customerId;

	@PalmyraField
	private String customerName;

	@PalmyraField
	private LocalDate customerDob;

	@PalmyraField
	private LocalDate doc;

	@PalmyraField
	private Long divisionCode;

	@PalmyraField
	private String branchCode;

	@PalmyraField
	private String batchNumber;

	@PalmyraField
	private String boxNumber;

	@PalmyraField
	private Integer rmsStatus;

	@PalmyraField
	private String uploadLabel;

	@PalmyraField
	private Long field1;

	@PalmyraField
	private String field2;

	@PalmyraField
	private String field3;

	@PalmyraField
	private String mobileNumber;

	@PalmyraField
	private Integer policyStatus;

}
