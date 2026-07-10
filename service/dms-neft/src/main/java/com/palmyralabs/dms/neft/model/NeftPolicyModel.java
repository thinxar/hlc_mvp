package com.palmyralabs.dms.neft.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * Plain DTO returned by NeftPolicyService (JPA path). Not an api2db type — the
 * api2db file handler uses {@link NeftPolicyRefModel} for the nested parent so it
 * never has to process the uidAdvreference list.
 */
@Getter
@Setter
public class NeftPolicyModel {

	private Integer id;

	private Long policyNumber;

	private List<UidAdvReference> uidAdvreference;

}
