package com.palmyralabs.dms.jpa.entity;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "mst_rev_srNo")
public class RevSrNoEntity {

	@AutoIncrementId
	private Integer id;
	
	@Indexed(unique = true)
	private String code;
	
	@Indexed(unique = true)
	private String name;
	
	private String description;
	
}
