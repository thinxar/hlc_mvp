package com.palmyralabs.dms.jpa.config;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SequenceCounter {
	private String id;
	private Integer seq;
}
