package com.palmyralabs.dms.policyBazaar.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PbzProposalModel {
	
	private Integer id;
	
	private String agentCode;

	private String ackNo;

	private String laName;

	private String proposalType;

	private String proposalNo;
	
	private Long policyNumber;

	private String year;

	private String boCode;
	
	private String dob;
	
	private String mobileNo;
	
}
