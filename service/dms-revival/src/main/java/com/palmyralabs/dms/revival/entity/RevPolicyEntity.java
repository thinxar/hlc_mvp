package com.palmyralabs.dms.revival.entity;


import java.time.LocalDate;

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
@Table(name = "rev_policy")
public class RevPolicyEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "policy_number")
	private String policyNumber;

	@Column(name = "doc_type")
	private String docType;

	@Column(name = "doc_sub_type")
	private String docSubType;

	@Column(name = "sr_no")
	private String srNo;

	@Column(name = "asr_no")
	private String asrNo;

	@Column(name = "so_code")
	private String soCode;

	@Column(name = "do_code")
	private String doCode;

	@Column(name = "date_of_submission")
	private LocalDate dateOfSubmission;

	@Column(name = "uploaded_by")
	private String uploadedBy;

	@Column(name = "bo_code")
	private String boCode;

}
