package com.palmyralabs.dms.masterdata.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.jpa.entity.RevSrNoEntity;
import com.palmyralabs.dms.jpa.repository.RevSrNoRepository;
import com.palmyralabs.dms.masterdata.model.RevSrNoModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevSrNoService {

	private final RevSrNoRepository repository;

	public RevSrNoModel createSrNo(RevSrNoModel model) {
		RevSrNoEntity SrNoEntity = new RevSrNoEntity();
		SrNoEntity.setCode(model.getCode());
		SrNoEntity.setName(model.getName());
		SrNoEntity.setDescription(model.getDescription());

		RevSrNoEntity savedSrNoEntity = repository.save(SrNoEntity);
		return toModel(savedSrNoEntity);
	}


	public List<RevSrNoModel> getAll() {
		List<RevSrNoEntity> entities = repository.findAll();
		List<RevSrNoModel> models = new ArrayList<>();

		for (RevSrNoEntity entity : entities) {
			models.add(toModel(entity));
		}
		return models;
	}

	public RevSrNoModel getById(Integer id) {
		Optional<RevSrNoEntity> entity = repository.findById(id);
		if (entity.isEmpty()) {
			throw new InvalidInputException("INV404", "SrNo not found");
		}
		return toModel(entity.get());
	}

	private RevSrNoModel toModel(RevSrNoEntity entity) {
		RevSrNoModel model = new RevSrNoModel();
		model.setId(entity.getId());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		model.setName(entity.getName());
		return model;
	}
}

