package com.palmyralabs.dms.jpa.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "mst_document_type")
public class DocumentTypeEntity {

	@AutoIncrementId
	private Integer id;
	
	private String document;
	
	private String description;
	
	private String code;
	
}
