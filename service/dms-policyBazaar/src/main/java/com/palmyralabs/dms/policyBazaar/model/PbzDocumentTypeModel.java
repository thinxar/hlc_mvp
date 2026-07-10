package com.palmyralabs.dms.policyBazaar.model;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "PbzDocType")
public class PbzDocumentTypeModel {

	@PalmyraField(primaryKey = true)
	private Integer id;

	@PalmyraField
	private String document;

	@PalmyraField
	private String description;

	@PalmyraField
	private String code;

}
