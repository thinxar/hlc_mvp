package com.palmyralabs.dms.neft.entity;

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.palmyralabs.dms.neft.model.UidAdvReference;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Persists the nested {@code uidAdvreference} list (a JSON array in the former
 * MongoDB document) as a JSON string in a single Postgres text column.
 */
@Converter
public class UidAdvReferenceConverter implements AttributeConverter<List<UidAdvReference>, String> {

	private static final ObjectMapper MAPPER = new ObjectMapper();
	private static final TypeReference<List<UidAdvReference>> TYPE = new TypeReference<>() {
	};

	@Override
	public String convertToDatabaseColumn(List<UidAdvReference> attribute) {
		if (attribute == null || attribute.isEmpty()) {
			return null;
		}
		try {
			return MAPPER.writeValueAsString(attribute);
		} catch (Exception e) {
			throw new IllegalArgumentException("Unable to serialize uidAdvreference", e);
		}
	}

	@Override
	public List<UidAdvReference> convertToEntityAttribute(String dbData) {
		if (dbData == null || dbData.isBlank()) {
			return null;
		}
		try {
			return MAPPER.readValue(dbData, TYPE);
		} catch (Exception e) {
			throw new IllegalArgumentException("Unable to deserialize uidAdvreference", e);
		}
	}
}
