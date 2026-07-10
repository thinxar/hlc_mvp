package com.palmyralabs.dms.neft.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

/**
 * Plain DTO returned by NeftPolicyFileService (JPA + mapper). NOT an api2db type:
 * the nested policyId carries the uidAdvreference list, which api2db cannot
 * serialize (it treats every List field as a child collection). The frontend's
 * NeftPolicyDetailForm renders policyId.uidAdvreference, so it must be present.
 */
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
