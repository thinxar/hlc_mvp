package com.palmyralabs.dms.ananda.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AndProposalFileModel {

	private Integer id;

	private AndProposalModel policyId;

	private String fileName;

	private Long fileSize;

	private String fileType;

	private AndDocumentTypeModel docketType;

	private String objectUrl;

	private LocalDateTime createdOn;

	private String status;

	private String srNo;

	private LocalDateTime actionOn;

	private String actionBy;
}
