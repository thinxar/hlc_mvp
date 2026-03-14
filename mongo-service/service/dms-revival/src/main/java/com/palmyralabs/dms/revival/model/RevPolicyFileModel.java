package com.palmyralabs.dms.revival.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RevPolicyFileModel {

	private Integer id;

	private RevPolicyModel policyId;

	private String fileName;

	private Long fileSize;

	private String fileType;

	private RevDocumentTypeModel docketType;

	private String objectUrl;

	private LocalDateTime createdOn;

	private String status;

	private String srNo;

	private LocalDateTime actionOn;

	private String actionBy;
}
