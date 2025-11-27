package com.palmyralabs.dms.jpa.entity;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "dms_policy_file")
public class PolicyFileEntity{
	
	@AutoIncrementId
	private Integer id;
	
	private PolicyEntity policyId;

	private String fileName;
	
	private Long fileSize;

	private String fileType;

	private DocumentTypeEntity docketType;

	private String objectUrl;
	
	private LocalDateTime createdOn;
	
	private String createdBy;

}
