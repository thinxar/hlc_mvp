package com.palmyralabs.dms.policyBazaar.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PbzPolicyModel {
	
	private Integer id;
	
	private String agentCode;

	private String ackNo;

	private String lanName;

	private String proposalType;

	private String proposalNo;
	
	private Long policyNumber;

	private String year;

	private String planCode;

	private String requestTime;

	private String processTime;

	private String boCode;
	
	private String soCode;

}
