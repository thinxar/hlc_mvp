package com.palmyralabs.dms.masterdata.model;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@PalmyraType(type = "MstEndorsementType")
public class EndorsementTypeModel {

	@PalmyraField
	private Long id;
	
	@PalmyraField
	private String name;
	
	@PalmyraField
	private String code;
	
	@PalmyraField
	private String description;
}
