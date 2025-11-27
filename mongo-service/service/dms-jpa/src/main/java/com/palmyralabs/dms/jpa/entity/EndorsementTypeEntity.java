package com.palmyralabs.dms.jpa.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "mst_endorsement_type")
public class EndorsementTypeEntity {

	@AutoIncrementId
	private Integer id;
	
	private String name;
	
	private String code;
	
	private String description;
}
