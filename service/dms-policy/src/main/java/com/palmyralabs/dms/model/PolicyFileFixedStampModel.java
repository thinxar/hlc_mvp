package com.palmyralabs.dms.model;

import java.time.LocalDateTime;

import com.palmyralabs.dms.masterdata.model.FixedStampModel;
import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "DmsPolicyFileFixedStamp")
public class PolicyFileFixedStampModel {

	@PalmyraField(keyField = true)
	private Long id;

	@PalmyraField
	private PolicyFileModel policyFile;

	@PalmyraField
	private FixedStampModel stamp;
	
	@PalmyraField
	private LocalDateTime createdOn;
	
	@PalmyraField
	private String position;

}
