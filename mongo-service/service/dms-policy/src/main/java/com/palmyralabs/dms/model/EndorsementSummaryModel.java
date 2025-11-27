package com.palmyralabs.dms.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EndorsementSummaryModel {
	
	private Integer id;
	
	private Integer policyId;
	
	private String fileName;
	
	private String fileType;
	
	private LocalDateTime createdOn;
	
	private String createdBy;
}
