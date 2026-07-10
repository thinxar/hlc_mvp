package com.palmyralabs.dms.ananda.entity;

import com.palmyra.dms.jpa.config.AuditListener;
import com.palmyralabs.dms.jpa.entity.Auditable;
import com.palmyralabs.dms.jpa.entity.Timestamps;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "and_policy")
@EntityListeners(AuditListener.class)
public class AndProposalEntity implements Auditable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "policy_number")
	private Long policyNumber;

	@Column(name = "agent_code")
	private String agentCode;

	@Column(name = "ack_no")
	private String ackNo;

	@Column(name = "la_name")
	private String laName;

	@Column(name = "proposal_type")
	private String proposalType;

	@Column(name = "proposal_no")
	private String proposalNo;

	@Column(name = "year")
	private String year;

	@Column(name = "bo_code")
	private String boCode;

	@Column(name = "plan_code")
	private String planCode;

	@Column(name = "object_submitted_on")
	private String objectSubmittedOn;

	@Column(name = "request_time")
	private String requestTime;

	@Column(name = "process_time")
	private String processTime;
	
	private Timestamps timestamps;

}