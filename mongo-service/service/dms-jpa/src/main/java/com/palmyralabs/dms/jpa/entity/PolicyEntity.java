package com.palmyralabs.dms.jpa.entity;

import java.time.LocalDate;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "dms_policy")
public class PolicyEntity{

	@AutoIncrementId
	private Integer id;

	private Long policyNumber;

	private String customerId;

	private String customerName;

	private LocalDate customerDob;

	private LocalDate doc;

	private Long divisionCode;

	private String branchCode;

	private String batchNumber;

	private String boxNumber;

	private Integer rmsStatus;

	private String uploadLabel;

	private Long field1;

	private String field2;

	private String field3;

	private String mobileNumber;

	private Integer policyStatus;

}
