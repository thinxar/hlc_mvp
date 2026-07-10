package com.palmyralabs.dms.revival.model;

import java.time.LocalDate;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "RevPolicy")
public class RevPolicyModel {

	@PalmyraField(primaryKey = true)
	private Integer id;

	@PalmyraField
	private String policyNumber;

	@PalmyraField
	private String docType;

	@PalmyraField
	private String docSubType;

	@PalmyraField
	private String srNo;

	@PalmyraField
	private String asrNo;

	@PalmyraField
	private String soCode;

	@PalmyraField
	private String doCode;

	@PalmyraField
	private LocalDate dateOfSubmission;

	@PalmyraField
	private String uploadedBy;

	@PalmyraField
	private String boCode;

}
