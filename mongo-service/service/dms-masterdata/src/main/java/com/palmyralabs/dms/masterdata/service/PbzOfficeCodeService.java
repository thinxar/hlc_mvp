package com.palmyralabs.dms.masterdata.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.jpa.entity.PbzOfficeCodeEntity;
import com.palmyralabs.dms.jpa.repository.PbzOfficeCodeRepository;
import com.palmyralabs.dms.masterdata.model.PbzOfficeCodeModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PbzOfficeCodeService {

	private final PbzOfficeCodeRepository repository;

	public PbzOfficeCodeModel createOfficeCode(PbzOfficeCodeModel model) {
		PbzOfficeCodeEntity OfficeCodeEntity = new PbzOfficeCodeEntity();
		OfficeCodeEntity.setCode(model.getCode());
		OfficeCodeEntity.setName(model.getName());
		OfficeCodeEntity.setDescription(model.getDescription());

		PbzOfficeCodeEntity savedOfficeCodeEntity = repository.save(OfficeCodeEntity);
		return toModel(savedOfficeCodeEntity);
	}


	public List<PbzOfficeCodeModel> getAll() {
		List<PbzOfficeCodeEntity> entities = repository.findAll();
		List<PbzOfficeCodeModel> models = new ArrayList<>();

		for (PbzOfficeCodeEntity entity : entities) {
			models.add(toModel(entity));
		}
		return models;
	}

	public PbzOfficeCodeModel getById(Integer id) {
		Optional<PbzOfficeCodeEntity> entity = repository.findById(id);
		if (entity.isEmpty()) {
			throw new InvalidInputException("INV404", "OfficeCode not found");
		}
		return toModel(entity.get());
	}

	private PbzOfficeCodeModel toModel(PbzOfficeCodeEntity entity) {
		PbzOfficeCodeModel model = new PbzOfficeCodeModel();
		model.setId(entity.getId());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		model.setName(entity.getName());
		return model;
	}
}

