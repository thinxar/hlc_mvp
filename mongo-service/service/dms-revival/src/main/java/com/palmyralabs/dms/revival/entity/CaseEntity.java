package com.palmyralabs.dms.revival.entity;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "all_cases")
public class CaseEntity {

	@Id
	private String id;
	private String requestId;
	private LocalDate requestDate;
	private String doCode;
}
