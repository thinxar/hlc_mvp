package com.palmyralabs.dms.revival.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "rev_docType")
public class RevDocumentTypeEntity {

	@AutoIncrementId
	private Integer id;
	
	private String document;
	
	private String description;
	
	private String code;
}
