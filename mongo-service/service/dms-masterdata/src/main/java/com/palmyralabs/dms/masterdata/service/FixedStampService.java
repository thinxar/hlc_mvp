package com.palmyralabs.dms.masterdata.service;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.jpa.entity.FixedStampEntity;
import com.palmyralabs.dms.jpa.repository.FixedStampRepo;
import com.palmyralabs.dms.masterdata.model.FixedStampModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FixedStampService {

	private final FixedStampRepo repository;
	
	public FixedStampModel createFixedStamp(FixedStampModel model) {
		FixedStampEntity fixedStampEntity = new FixedStampEntity();
	
		fixedStampEntity.setCode(model.getCode());
		fixedStampEntity.setDescription(model.getDescription());
		fixedStampEntity.setName(model.getName());
		FixedStampEntity savedFixedStampEntity = repository.save(fixedStampEntity);
		return toModel(savedFixedStampEntity);
	}

	public List<FixedStampModel> getAll() {
		List<FixedStampEntity> entities = repository.findAll();
		List<FixedStampModel> models = new ArrayList<>();

		for (FixedStampEntity entity : entities) {
			models.add(toModel(entity));
		}
		return models;
	}

	public FixedStampModel getById(Integer id) {
		Optional<FixedStampEntity> entity = repository.findById(id);
		if (entity.isEmpty()) {
			throw new InvaidInputException("INV404", "Fixed stamp not found");
		}
		return toModel(entity.get());
	}

	private FixedStampModel toModel(FixedStampEntity entity) {
		FixedStampModel model = new FixedStampModel();
		model.setId(entity.getId());
		model.setName(entity.getName());
		model.setCode(entity.getCode());
		model.setDescription(entity.getDescription());
		return model;
	}
}

