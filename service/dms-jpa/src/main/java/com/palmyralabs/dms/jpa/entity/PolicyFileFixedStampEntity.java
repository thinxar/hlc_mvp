package com.palmyralabs.dms.jpa.entity;

import com.palmyra.dms.jpa.config.AuditListener;

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
@Table(name = "dms_policy_file_fixed_stamp")
@EntityListeners(AuditListener.class)
public class PolicyFileFixedStampEntity implements Auditable{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "policy_file")
	private Long policyFile;
	
	@Column(name = "stamp")
	private Long stamp;

	private Timestamps timestamps;
	
}
