package com.palmyralabs.dms.ananda.entity;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "and_policy")
public class AndProposalEntity {

	@AutoIncrementId
	private Integer id;

	private Long policyNumber;

	private String agentCode;

	private String ackNo;

	private String laName;

	private String proposalType;

	@Indexed(unique = true)
	private String proposalNo;

	private String year;

	private String boCode;

	private String planCode;
	
	private String objectSubmittedOn;
	
	private String requestTime;
	
	private String processTime;
	

}