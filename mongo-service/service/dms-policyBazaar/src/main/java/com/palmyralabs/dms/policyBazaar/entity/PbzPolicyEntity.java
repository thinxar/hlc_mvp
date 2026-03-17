package com.palmyralabs.dms.policyBazaar.entity;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "pbz_policy")
public class PbzPolicyEntity {

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

	private String dob;

	private String mobileNo;

}