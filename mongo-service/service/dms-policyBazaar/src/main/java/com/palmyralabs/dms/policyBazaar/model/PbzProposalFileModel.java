package com.palmyralabs.dms.policyBazaar.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PbzProposalFileModel {

	private Integer id;

	private PbzProposalModel policyId;

	private String fileName;

	private Long fileSize;

	private String fileType;

	private PbzDocumentTypeModel docketType;

	private String objectUrl;

	private LocalDateTime createdOn;

	private String status;

	private String srNo;

	private LocalDateTime actionOn;

	private String actionBy;
}
