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
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "neft_doc_type")
@EntityListeners(AuditListener.class)
public class NeftDocumentTypeEntity implements Auditable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;
	
	@Column(name = "document")
	private String document;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "code")
	private String code;
	
	private Timestamps timestamps;
}
