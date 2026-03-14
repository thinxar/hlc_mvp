package com.palmyralabs.dms.revival.entity;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "rev_policy_file")
public class RevPolicyFileEntity {

	@AutoIncrementId
	private Integer id;
	
	private RevPolicyEntity policyId;

	private String fileName;
	
	private Long fileSize;

	private String fileType;

	private RevDocumentTypeEntity docketType;

	private String objectUrl;
	
	private LocalDateTime createdOn;
	
	private String createdBy;
	
	private String status;
	
	private LocalDateTime actionOn;
	
	private String actionBy;

}
