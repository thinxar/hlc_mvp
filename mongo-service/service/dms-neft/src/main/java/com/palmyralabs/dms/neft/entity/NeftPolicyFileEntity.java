package com.palmyralabs.dms.neft.entity;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "neft_policy_file")
public class NeftPolicyFileEntity {

	@AutoIncrementId
	private Integer id;
	
	private NeftPolicyEntity policyId;

	private String fileName;
	
	private Long fileSize;

	private String fileType;

	private NeftDocumentTypeEntity docketType;

	private String objectUrl;
	
	private LocalDateTime createdOn;
	
	private String createdBy;
	
}
