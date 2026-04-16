package com.palmyralabs.dms.masterdata.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.jpa.entity.RevOfficeCodeEntity;
import com.palmyralabs.dms.jpa.repository.RevOfficeCodeRepository;
import com.palmyralabs.dms.masterdata.model.RevOfficeCodeModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevOfficeCodeService {

	private final RevOfficeCodeRepository repository;

	public RevOfficeCodeModel createOfficeCode(RevOfficeCodeModel model) {
		RevOfficeCodeEntity OfficeCodeEntity = new RevOfficeCodeEntity();
		OfficeCodeEntity.setCode(model.getCode());
		OfficeCodeEntity.setName(model.getName());
		OfficeCodeEntity.setDescription(model.getDescription());

		RevOfficeCodeEntity savedOfficeCodeEntity = repository.save(OfficeCodeEntity);
		return toModel(savedOfficeCodeEntity);
	}


	public List<RevOfficeCodeModel> getAll() {
		List<RevOfficeCodeEntity> entities = repository.findAll();
		List<RevOfficeCodeModel> models = new ArrayList<>();

		for (RevOfficeCodeEntity entity : entities) {
			models.add(toModel(entity));
		}
		return models;
	}

	public RevOfficeCodeModel getById(Integer id) {
		Optional<RevOfficeCodeEntity> entity = repository.findById(id);
		if (entity.isEmpty()) {
			throw new InvalidInputException("INV404", "OfficeCode not found");
		}
		return toModel(entity.get());
	}

	private RevOfficeCodeModel toModel(RevOfficeCodeEntity entity) {
		RevOfficeCodeModel model = new RevOfficeCodeModel();
		model.setId(entity.getId());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		model.setName(entity.getName());
		return model;
	}
}

