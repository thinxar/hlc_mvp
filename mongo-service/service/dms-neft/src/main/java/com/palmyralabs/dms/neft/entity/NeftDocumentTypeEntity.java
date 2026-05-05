package com.palmyralabs.dms.neft.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "neft_docType")
public class NeftDocumentTypeEntity {

	@AutoIncrementId
	private Integer id;
	
	private String document;
	
	private String description;
	
	private String code;
}
