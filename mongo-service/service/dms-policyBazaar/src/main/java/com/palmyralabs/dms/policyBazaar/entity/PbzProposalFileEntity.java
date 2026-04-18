package com.palmyralabs.dms.policyBazaar.entity;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "pbz_policy_file")
public class PbzProposalFileEntity {

	@AutoIncrementId
	private Integer id;
	
	private PbzProposalEntity policyId;

	private String fileName;
	
	private Long fileSize;

	private String fileType;

	private PbzDocumentTypeEntity docketType;

	private String objectUrl;
	
	private LocalDateTime createdOn;
	
	private String createdBy;
	
	private String status;
	
	private LocalDateTime actionOn;
	
	private String actionBy;

}
