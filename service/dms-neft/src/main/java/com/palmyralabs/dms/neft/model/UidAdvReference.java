package com.palmyralabs.dms.neft.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UidAdvReference {

	private Integer uid;
	
	private List<Long> advReferenceNumbers;
}
