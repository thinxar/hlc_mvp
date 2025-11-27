package com.palmyralabs.dms.model;

import java.time.LocalDateTime;

import com.palmyralabs.dms.masterdata.model.FixedStampModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyFileFixedStampModel {

	private Long id;

	private PolicyFileModel policyFile;

	private FixedStampModel stamp;
	
	private LocalDateTime createdOn;
	
	private String position;

}
