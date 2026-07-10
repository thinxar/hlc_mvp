package com.palmyralabs.dms.revival.entity;

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Persists the nested {@code perApprover} list of a monthly branch-wise report
 * (formerly a JSON array in the MongoDB document) as a JSON string in a single
 * Postgres text column.
 */
@Converter
public class MonthPerApproverListConverter
		implements AttributeConverter<List<MonthWiseReportEntity.PerApprover>, String> {

	private static final ObjectMapper MAPPER = new ObjectMapper();
	private static final TypeReference<List<MonthWiseReportEntity.PerApprover>> TYPE = new TypeReference<>() {
	};

	@Override
	public String convertToDatabaseColumn(List<MonthWiseReportEntity.PerApprover> attribute) {
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
	public List<MonthWiseReportEntity.PerApprover> convertToEntityAttribute(String dbData) {
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
