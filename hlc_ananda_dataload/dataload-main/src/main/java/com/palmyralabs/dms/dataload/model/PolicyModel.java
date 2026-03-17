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

	private String agentCode;

	private String ackNo;

	private String lanName;

	private String proposalType;

	private String proposalNo;
	
	private Integer policyNumber;

	private String year;

	private String planCode;

	private String requestTime;

	private String processTime;

	private String boCode;
	
	private String soCode;

}
