package com.palmyralabs.dms.policyBazaar.model;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "PbzPolicy")
public class PbzProposalLookUpModel {

	@PalmyraField(primaryKey = true)
	private Integer id;

	@PalmyraField
	private String proposalNo;

}
