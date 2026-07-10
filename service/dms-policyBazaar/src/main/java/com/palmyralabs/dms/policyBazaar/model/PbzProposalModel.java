package com.palmyralabs.dms.policyBazaar.model;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "PbzPolicy")
public class PbzProposalModel {

	@PalmyraField(primaryKey = true)
	private Integer id;

	@PalmyraField
	private String agentCode;

	@PalmyraField
	private String ackNo;

	@PalmyraField
	private String laName;

	@PalmyraField
	private String proposalType;

	@PalmyraField
	private String proposalNo;

	@PalmyraField
	private Long policyNumber;

	@PalmyraField
	private String year;

	@PalmyraField
	private String boCode;

	@PalmyraField
	private String dob;

	@PalmyraField
	private String mobileNo;

}
