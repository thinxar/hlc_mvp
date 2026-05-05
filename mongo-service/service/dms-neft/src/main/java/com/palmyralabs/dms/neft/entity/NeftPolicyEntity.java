package com.palmyralabs.dms.neft.entity;


import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "neft_policy")
public class NeftPolicyEntity {

	@AutoIncrementId
	private Integer id;

	private Long policyNumber;

	private List<Integer> uid;
	
	private List<Long> advReferenceNumber;
	
	
}