package com.palmyralabs.dms.policyBazaar.model;

import java.time.LocalDateTime;

import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;
import com.palmyralabs.palmyra.base.format.Mandatory;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "PbzPolicyFile")
public class PbzProposalFileModel {

	@PalmyraField(primaryKey = true)
	private Integer id;

	@PalmyraField(mandatory = Mandatory.ALL)
	private PbzProposalModel policyId;

	@PalmyraField
	private String fileName;

	@PalmyraField
	private Long fileSize;

	@PalmyraField
	private String fileType;

	@PalmyraField
	private PbzDocumentTypeModel docketType;

	@PalmyraField
	private String objectUrl;

	@PalmyraField
	private LocalDateTime createdOn;

	@PalmyraField
	private String status;

	@PalmyraField
	private LocalDateTime actionOn;

	@PalmyraField
	private String actionBy;
}
