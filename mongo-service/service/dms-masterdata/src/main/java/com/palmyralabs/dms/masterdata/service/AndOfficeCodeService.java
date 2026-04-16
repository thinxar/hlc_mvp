package com.palmyralabs.dms.masterdata.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.jpa.entity.AndOfficeCodeEntity;
import com.palmyralabs.dms.jpa.repository.AndOfficeCodeRepository;
import com.palmyralabs.dms.masterdata.model.AndOfficeCodeModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AndOfficeCodeService {

	private final AndOfficeCodeRepository repository;

	public AndOfficeCodeModel createOfficeCode(AndOfficeCodeModel model) {
		AndOfficeCodeEntity OfficeCodeEntity = new AndOfficeCodeEntity();
		OfficeCodeEntity.setCode(model.getCode());
		OfficeCodeEntity.setName(model.getName());
		OfficeCodeEntity.setDescription(model.getDescription());

		AndOfficeCodeEntity savedOfficeCodeEntity = repository.save(OfficeCodeEntity);
		return toModel(savedOfficeCodeEntity);
	}


	public List<AndOfficeCodeModel> getAll() {
		List<AndOfficeCodeEntity> entities = repository.findAll();
		List<AndOfficeCodeModel> models = new ArrayList<>();

		for (AndOfficeCodeEntity entity : entities) {
			models.add(toModel(entity));
		}
		return models;
	}

	public AndOfficeCodeModel getById(Integer id) {
		Optional<AndOfficeCodeEntity> entity = repository.findById(id);
		if (entity.isEmpty()) {
			throw new InvalidInputException("INV404", "OfficeCode not found");
		}
		return toModel(entity.get());
	}

	private AndOfficeCodeModel toModel(AndOfficeCodeEntity entity) {
		AndOfficeCodeModel model = new AndOfficeCodeModel();
		model.setId(entity.getId());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		model.setName(entity.getName());
		return model;
	}
}

