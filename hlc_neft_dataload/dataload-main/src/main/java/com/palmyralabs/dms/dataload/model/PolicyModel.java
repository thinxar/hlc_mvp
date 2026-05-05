package com.palmyralabs.dms.dataload.model;

import java.util.List;

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

	private Integer policyNumber;

	private List<Integer> uid;
	
	private List<Long> advReferenceNumber;

}
