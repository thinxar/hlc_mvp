package com.palmyralabs.dms.jpa.entity;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "dms_policy_file_fixed_stamp")
public class PolicyFileFixedStampEntity{

	@AutoIncrementId
	private Integer id;
	
	private PolicyFileEntity policyFile;
	
	private FixedStampEntity stamp;
	
	private String position;

	private LocalDateTime createdOn;
	
}
