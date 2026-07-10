package com.palmyralabs.dms.ananda.model;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "AndPolicy")
public class AndProposalLookUpModel {

	@PalmyraField(primaryKey = true)
	private Integer id;

	@PalmyraField
	private String proposalNo;

}
