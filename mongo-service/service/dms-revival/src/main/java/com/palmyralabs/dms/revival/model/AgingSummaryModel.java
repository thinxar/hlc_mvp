package com.palmyralabs.dms.revival.model;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgingSummaryModel {
	private LocalDate calDate;
	private LocalDate calWeek;
	private LocalDate calMonth;
	private Long pendingDocuments;
	private Long d0_5;
	private Long d6_10;
	private Long d11_20;
	private Long d21_30;
	private Long d31_45;
	private Long d45plus;
}
