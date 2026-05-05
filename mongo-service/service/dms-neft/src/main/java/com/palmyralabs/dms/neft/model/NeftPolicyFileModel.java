package com.palmyralabs.dms.neft.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NeftPolicyFileModel {

	private Integer id;

	private NeftPolicyModel policyId;

	private String fileName;

	private Long fileSize;

	private String fileType;

	private NeftDocumentTypeModel docketType;

	private String objectUrl;

	private LocalDateTime createdOn;

	private String createdBy;
}
