package com.palmyralabs.dms.jpa.entity;

public interface Auditable {
	Timestamps getTimestamps();
	
	void setTimestamps(Timestamps t);
}
