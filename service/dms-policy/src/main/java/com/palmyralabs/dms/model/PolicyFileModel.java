package com.palmyralabs.dms.model;

import java.sql.Timestamp;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "DmsPolicyFile")
public class PolicyFileModel {
	@PalmyraField(keyField = true)
	private Integer id;
	@PalmyraField
	private Long policyFileId;
	@PalmyraField
	private String policyNumber;
	@PalmyraField
	private String fileName;
	@PalmyraField
	private Long fileSize;
	@PalmyraField
	private String fileType;
	@PalmyraField
	private String uuid;
	@PalmyraField
	private Long currentOffset;
	@PalmyraField
	private Integer fileStatus;
	@PalmyraField
	private String fileLocation;
	@PalmyraField
	private String createdBy;
	@PalmyraField
	private String lastUpdBy;
	@PalmyraField
	private Timestamp createdOn;
	@PalmyraField
	private Timestamp lastUpdOn;

}
