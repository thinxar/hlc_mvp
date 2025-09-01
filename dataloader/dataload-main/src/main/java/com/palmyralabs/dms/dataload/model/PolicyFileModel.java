package com.palmyralabs.dms.dataload.model;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyFileModel {	
	private Long id;

	private PolicyModel policyId;

	private String fileName;

	private Long fileSize;

	private String fileType;

	private DocumentTypeModel docketType;

	private String objectUrl;

}
