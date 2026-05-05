package com.palmyralabs.dms.neft.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NeftPolicyModel {
	
	private Integer id;

	private Long policyNumber;

	private List<Integer> uid;
	
	private List<Long> advReferenceNumber;
	
}
