package com.palmyralabs.dms.ananda.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "and_docType")
public class AndDocumentTypeEntity {

	@AutoIncrementId
	private Integer id;
	
	private String document;
	
	private String description;
	
	private String code;
}
