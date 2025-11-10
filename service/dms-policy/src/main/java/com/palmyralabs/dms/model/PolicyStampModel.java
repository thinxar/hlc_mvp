package com.palmyralabs.dms.model;

import com.palmyralabs.dms.masterdata.model.FixedStampModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyStampModel {

	private FixedStampModel stamp;
	private String createdOn;
}
