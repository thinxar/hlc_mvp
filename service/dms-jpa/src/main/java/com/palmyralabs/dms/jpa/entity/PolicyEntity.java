package com.palmyralabs.dms.jpa.entity;

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
@Table(name = "dms_policy")
public class PolicyEntity implements Auditable{
	@Id
	@Column(name = "id")
	private Long id;
	
	@Column(name = "policy_number")
	private Long policyNumber;
	
	@Column(name = "customer_id")
	private String customerId;
	
	@Column(name = "customer_name")
	private String customerName;
	
	@Column(name = "customer_dob")
	private LocalDate customerDob;
	
	@Column(name = "doc")
	private LocalDate doc;
	
	@Column(name = "division_code")
	private Long divisionCode;
	
	@Column(name = "branch_code")
	private String branchCode;
	
	@Column(name = "batch_number")
	private String batchNumber;
	
	@Column(name = "box_number")
	private String boxNumber;
	
	@Column(name = "rms_status")
	private Integer rmsStatus;
	
	@Column(name = "upload_label")
	private String uploadLabel;
	
	private Long field1;
	
	private String field2;
	
	private String field3;
	
	@Column(name = "mobile_number")
	private String mobileNumber;
	
	@Column(name = "policy_status")
	private String policyStatus;
	
	private Timestamps timestamps;
}
