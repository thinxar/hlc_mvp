package com.palmyralabs.dms.jpa.entity;

import java.time.LocalDate;
import java.util.Date;

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
	@Column(name = "policy_number")
	private Integer policyNumber;
	
	@Column(name = "policy_date")
	private LocalDate policyDate;
	
	@Column(name = "customer_id")
	private String customerId;
	
	private String name;
	
	private LocalDate dob;
	
	private LocalDate doc;
	
	@Column(name = "division_code")
	private Long divisionCode;
	
	@Column(name = "branch_code")
	private String branchCode;
	
	@Column(name = "branch_number")
	private String branchNumber;
	
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
	private Integer policyStatus;
	
	private String region;
	
	private Timestamps timestamps;
}
