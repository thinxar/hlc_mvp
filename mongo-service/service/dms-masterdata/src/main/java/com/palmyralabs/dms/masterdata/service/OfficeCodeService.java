package com.palmyralabs.dms.masterdata.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.jpa.entity.OfficeCodeEntity;
import com.palmyralabs.dms.jpa.repository.OfficeCodeRepository;
import com.palmyralabs.dms.masterdata.model.OfficeCodeModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OfficeCodeService {

	private final OfficeCodeRepository repository;

	public OfficeCodeModel createOfficeCode(OfficeCodeModel model) {
		OfficeCodeEntity OfficeCodeEntity = new OfficeCodeEntity();
		OfficeCodeEntity.setCode(model.getCode());
		OfficeCodeEntity.setName(model.getName());
		OfficeCodeEntity.setDescription(model.getDescription());

		OfficeCodeEntity savedOfficeCodeEntity = repository.save(OfficeCodeEntity);
		return toModel(savedOfficeCodeEntity);
	}


	public List<OfficeCodeModel> getAll() {
		List<OfficeCodeEntity> entities = repository.findAll();
		List<OfficeCodeModel> models = new ArrayList<>();

		for (OfficeCodeEntity entity : entities) {
			models.add(toModel(entity));
		}
		return models;
	}

	public OfficeCodeModel getById(Integer id) {
		Optional<OfficeCodeEntity> entity = repository.findById(id);
		if (entity.isEmpty()) {
			throw new InvalidInputException("INV404", "OfficeCode not found");
		}
		return toModel(entity.get());
	}

	private OfficeCodeModel toModel(OfficeCodeEntity entity) {
		OfficeCodeModel model = new OfficeCodeModel();
		model.setId(entity.getId());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		model.setName(entity.getName());
		return model;
	}
}

