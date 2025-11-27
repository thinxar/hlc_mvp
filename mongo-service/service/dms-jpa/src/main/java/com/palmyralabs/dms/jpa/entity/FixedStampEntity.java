package com.palmyralabs.dms.jpa.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "mst_fixed_stamp")
public class FixedStampEntity{

	@AutoIncrementId
	private Integer id;

	private String name;
	
	private String code;
	
	private String description;

}
