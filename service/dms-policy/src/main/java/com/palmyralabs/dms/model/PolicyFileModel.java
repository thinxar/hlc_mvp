package com.palmyralabs.dms.model;


import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;
import com.palmyralabs.palmyra.base.format.Mandatory;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "DmsPolicyFile")
public class PolicyFileModel {
	@PalmyraField(keyField = true)
	private Integer id;

	@PalmyraField(mandatory = Mandatory.ALL)
	private PolicyModel policyId;

	@PalmyraField
	private String fileName;

	@PalmyraField
	private Long fileSize;

	@PalmyraField
	private String fileType;

	@PalmyraField
	private Long docketType;

	@PalmyraField
	private String objectUrl;

}
