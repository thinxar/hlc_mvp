package com.palmyralabs.dms.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyStampPositionModel {

	private Long stampId;
	private Long pageNumber;
	private String left;
	private String scaleX;
	private String scaleY;
	private String top;
}
