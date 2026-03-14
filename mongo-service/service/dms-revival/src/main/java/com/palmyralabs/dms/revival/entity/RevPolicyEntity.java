package com.palmyralabs.dms.revival.entity;


import java.time.LocalDate;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "rev_policy")
public class RevPolicyEntity {

	@AutoIncrementId
	private Integer id;

	private Long policyNumber;

	private String docType;
	
	private String docSubType;
	
	private String srNo;
	
	private String asrNo;
	
	private String soCode;
	
	private String doCode;
	
	private LocalDate dateOfSubmission;
	
	private String uploadedBy;
	
	private String boCode;
	
}