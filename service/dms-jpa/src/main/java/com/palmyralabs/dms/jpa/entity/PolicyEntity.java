package com.palmyralabs.dms.jpa.entity;

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
	private String policyNumber;
	
	@Column(name = "policy_date")
	private String policyDate;
	
	@Column(name = "policy_status")
	private int status;
	
	private String region;
	
	private Timestamps timestamps;
}
