package com.palmyralabs.dms.model;

import java.util.List;

import com.palmyralabs.dms.masterdata.model.FixedStampModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyStampRequest {

	private Long policyFileId;
	private List<FixedStampModel> stamp;
	
}
