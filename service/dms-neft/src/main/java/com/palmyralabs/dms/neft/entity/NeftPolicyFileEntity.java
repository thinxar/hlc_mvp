package com.palmyralabs.dms.neft.entity;

import com.palmyra.dms.jpa.config.AuditListener;
import com.palmyralabs.dms.jpa.entity.Auditable;
import com.palmyralabs.dms.jpa.entity.Timestamps;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "neft_policy_file")
@EntityListeners(AuditListener.class)
public class NeftPolicyFileEntity implements Auditable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "policy_id")
	private NeftPolicyEntity policyId;

	@Column(name = "file_name")
	private String fileName;

	@Column(name = "file_size")
	private Long fileSize;

	@Column(name = "file_type")
	private String fileType;

	@ManyToOne
	@JoinColumn(name = "docket_type")
	private NeftDocumentTypeEntity docketType;

	@Column(name = "object_url")
	private String objectUrl;

	private Timestamps timestamps;

}
