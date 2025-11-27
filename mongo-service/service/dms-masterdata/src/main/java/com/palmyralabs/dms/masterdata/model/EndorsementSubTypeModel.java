package com.palmyralabs.dms.masterdata.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EndorsementSubTypeModel {

	private Integer id;
	
	private EndorsementTypeModel endorsementType;

	private String name;
	
	private String code;
	
	private String description;
}
