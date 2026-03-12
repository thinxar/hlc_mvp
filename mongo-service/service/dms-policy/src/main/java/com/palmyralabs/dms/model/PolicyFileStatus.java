package com.palmyralabs.dms.model;

public enum PolicyFileStatus {
	PENDING("pending"), Approved("approved"), REJECTED("rejected");
	private final String value;

	private PolicyFileStatus(String v) {
		this.value = v;
	}

	public String getValue() {
		return value;
	}
	
}
