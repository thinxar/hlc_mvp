package com.palmyralabs.dms.revival.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rev_case")
public class CaseEntity {

	@Id
	@Column(name = "id")
	private String id;

	@Column(name = "request_id")
	private String requestId;

	@Column(name = "request_date")
	private LocalDate requestDate;

	@Column(name = "do_code")
	private String doCode;
}
