package com.palmyralabs.dms.model;

import java.sql.Timestamp;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "DmsPolicy")
public class PolicyModel {
	@PalmyraField(keyField = true)
	private Integer id;
	@PalmyraField
	private String policyNumber;
	@PalmyraField
	private String policyDate;
	@PalmyraField
	private int policyStatus;
	@PalmyraField
	private String region;
	@PalmyraField
	private String createdBy;
	@PalmyraField
	private String lastUpdBy;
	@PalmyraField
	private Timestamp createdOn;
	@PalmyraField
	private Timestamp lastUpdOn;

}
