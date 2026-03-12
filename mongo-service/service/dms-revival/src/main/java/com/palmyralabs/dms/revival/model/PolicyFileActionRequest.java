package com.palmyralabs.dms.revival.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyFileActionRequest {

	private Integer policyId;

	private String status; 

	private List<Integer> fileIds;
}
