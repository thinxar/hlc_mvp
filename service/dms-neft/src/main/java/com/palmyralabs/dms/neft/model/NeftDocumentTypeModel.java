package com.palmyralabs.dms.neft.model;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "NeftDocType")
public class NeftDocumentTypeModel {

	@PalmyraField(primaryKey = true)
	private Integer id;

	@PalmyraField
	private String document;

	@PalmyraField
	private String description;

	@PalmyraField
	private String code;

}
