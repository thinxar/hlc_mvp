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
public class FileAnnotationEntity implements Auditable{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "policy_file_id")
	private Long fileId;
	
	@Column(name = "position")
	private String position;
	
	@Column(name = "file_name")
	private String fileName;
	
	@Column(name = "file_size")
	private Long fileSize;

	@Column(name = "file_type")
	private String fileType;

	@Column(name = "uuid")
	private String uuid;

	@Column(name = "current_offset")
	private Long currentOffset;

	@Column(name = "file_status")
	private Integer fileStatus;

	@Column(name = "file_location")
	private String fileLocation;

	private Timestamps timestamps;
}
