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
@Table(name = "mst_document_type")
@EntityListeners(AuditListener.class)
public class DocumentTypeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "document")
	private String document;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "code")
	private String code;
	
	private Timestamps timestamps;
}
