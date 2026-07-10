package com.palmyralabs.dms.neft.entity;

import java.util.List;

import com.palmyra.dms.jpa.config.AuditListener;
import com.palmyralabs.dms.jpa.entity.Auditable;
import com.palmyralabs.dms.jpa.entity.Timestamps;
import com.palmyralabs.dms.neft.model.UidAdvReference;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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
@Table(name = "neft_policy")
@EntityListeners(AuditListener.class)
public class NeftPolicyEntity implements Auditable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "policy_number")
	private Long policyNumber;

	@Convert(converter = UidAdvReferenceConverter.class)
	@Column(name = "uid_adv_reference", columnDefinition = "text")
	private List<UidAdvReference> uidAdvreference;

	private Timestamps timestamps;
}
