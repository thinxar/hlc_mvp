package com.palmyralabs.dms.jpa.entity;

import java.time.LocalDate;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Timestamps {

	@CreatedBy
	private String createdBy;

	@LastModifiedBy
	private String lastUpdBy;

	@CreatedDate
	private LocalDate createdOn;

	@LastModifiedDate
	private LocalDate lastUpdOn;
}
