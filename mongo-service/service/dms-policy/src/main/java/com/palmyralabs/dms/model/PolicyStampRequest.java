package com.palmyralabs.dms.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyStampRequest {

	private Integer policyFileId;
	private List<PolicyStampPositionModel> stamp;
	
}
