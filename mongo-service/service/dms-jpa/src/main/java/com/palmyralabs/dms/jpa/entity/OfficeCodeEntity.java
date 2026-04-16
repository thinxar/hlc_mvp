package com.palmyralabs.dms.jpa.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "mst_office_code")
public class OfficeCodeEntity {

	@AutoIncrementId
	private Integer id;
	
	private String code;
	
	private String name;
	
}
