package com.palmyralabs.dms.ananda.model;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "AndPolicy")
public class AndProposalModel {

	@PalmyraField(primaryKey = true)
	private Integer id;

	@PalmyraField
	private Long policyNumber;

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
	private String year;

	@PalmyraField
	private String boCode;

	@PalmyraField
	private String planCode;

	@PalmyraField
	private String objectSubmittedOn;

	@PalmyraField
	private String requestTime;

	@PalmyraField
	private String processTime;

}
