package com.palmyralabs.dms.masterdata.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.jpa.entity.SrNoEntity;
import com.palmyralabs.dms.jpa.repository.SrNoRepository;
import com.palmyralabs.dms.masterdata.model.SrNoModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SrNoService {

	private final SrNoRepository repository;

	public SrNoModel createSrNo(SrNoModel model) {
		SrNoEntity SrNoEntity = new SrNoEntity();
		SrNoEntity.setCode(model.getCode());
		SrNoEntity.setName(model.getName());
		SrNoEntity.setDescription(model.getDescription());

		SrNoEntity savedSrNoEntity = repository.save(SrNoEntity);
		return toModel(savedSrNoEntity);
	}


	public List<SrNoModel> getAll() {
		List<SrNoEntity> entities = repository.findAll();
		List<SrNoModel> models = new ArrayList<>();

		for (SrNoEntity entity : entities) {
			models.add(toModel(entity));
		}
		return models;
	}

	public SrNoModel getById(Integer id) {
		Optional<SrNoEntity> entity = repository.findById(id);
		if (entity.isEmpty()) {
			throw new InvalidInputException("INV404", "SrNo not found");
		}
		return toModel(entity.get());
	}

	private SrNoModel toModel(SrNoEntity entity) {
		SrNoModel model = new SrNoModel();
		model.setId(entity.getId());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		model.setName(entity.getName());
		return model;
	}
}

