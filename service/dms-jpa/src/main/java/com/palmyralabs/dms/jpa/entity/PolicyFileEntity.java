package com.palmyralabs.dms.jpa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "dms_policy_file")
public class PolicyFileEntity implements Auditable{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "policy_id")
	private Long policyId;
	
	@Column(name = "file_name")
	private String fileName;
	
	@Column(name = "file_size")
	private Long fileSize;

	@Column(name = "file_type")
	private String fileType;

	@Column(name = "docket_type")
	private Long docketType;

	@Column(name = "object_url")
	private String objectUrl;

	private Timestamps timestamps;
}
