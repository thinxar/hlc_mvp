package com.palmyralabs.dms.masterdata.model;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "MstDocumentType")
public class DocumentTypeModel {

	@PalmyraField
	private Long id;
	
	@PalmyraField
	private String document;
	
	@PalmyraField
	private String description;
	
	@PalmyraField
	private String code;
	
}
