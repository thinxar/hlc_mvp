package com.palmyralabs.dms.model;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;
import net.sf.jsqlparser.expression.DateTimeLiteralExpression.DateTime;

@Getter
@Setter
@PalmyraType(type = "DmsPolicyFile")
public class EndorsementSummaryModel {
	
	@PalmyraField
	private Long id;
	
	@PalmyraField
	private Integer policyId;
	
	@PalmyraField
	private String fileName;
	
	@PalmyraField
	private DateTime createdOn;
}
