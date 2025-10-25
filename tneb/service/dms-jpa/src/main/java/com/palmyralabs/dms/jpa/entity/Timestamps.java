package com.palmyralabs.dms.jpa.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class Timestamps {

	private String createdBy;

	private String lastUpdBy;

	private LocalDateTime createdOn;

	private LocalDateTime lastUpdOn;
}
