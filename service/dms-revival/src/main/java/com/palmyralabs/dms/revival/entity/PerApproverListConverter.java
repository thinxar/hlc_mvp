package com.palmyralabs.dms.revival.entity;

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Persists the nested {@code perApprover} list of a daily branch-wise report
 * (formerly a JSON array in the MongoDB document) as a JSON string in a single
 * Postgres text column.
 */
@Converter
public class PerApproverListConverter
		implements AttributeConverter<List<DailyBranchWiseReportEntity.PerApprover>, String> {

	private static final ObjectMapper MAPPER = new ObjectMapper();
	private static final TypeReference<List<DailyBranchWiseReportEntity.PerApprover>> TYPE = new TypeReference<>() {
	};

	@Override
	public String convertToDatabaseColumn(List<DailyBranchWiseReportEntity.PerApprover> attribute) {
		if (attribute == null || attribute.isEmpty()) {
			return null;
		}
		try {
			return MAPPER.writeValueAsString(attribute);
		} catch (Exception e) {
			throw new IllegalArgumentException("Unable to serialize perApprover", e);
		}
	}

	@Override
	public List<DailyBranchWiseReportEntity.PerApprover> convertToEntityAttribute(String dbData) {
		if (dbData == null || dbData.isBlank()) {
			return null;
		}
		try {
			return MAPPER.readValue(dbData, TYPE);
		} catch (Exception e) {
			throw new IllegalArgumentException("Unable to deserialize perApprover", e);
		}
	}
}
