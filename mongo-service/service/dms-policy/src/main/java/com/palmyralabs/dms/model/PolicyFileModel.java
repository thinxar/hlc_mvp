package com.palmyralabs.dms.model;


import java.time.LocalDateTime;
import java.util.List;

import com.palmyralabs.dms.masterdata.model.DocumentTypeModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyFileModel {
	private Integer id;

	private PolicyModel policyId;

	private String fileName;

	private Long fileSize;

	private String fileType;

	private DocumentTypeModel docketType;

	private String objectUrl;
	
	private List<PolicyStampModel> fixedStamp;
	
	private LocalDateTime createdOn;

	
}
