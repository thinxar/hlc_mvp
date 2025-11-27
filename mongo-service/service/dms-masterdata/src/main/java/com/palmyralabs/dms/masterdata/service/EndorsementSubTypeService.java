package com.palmyralabs.dms.masterdata.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.jpa.entity.EndorsementSubTypeEntity;
import com.palmyralabs.dms.jpa.entity.EndorsementTypeEntity;
import com.palmyralabs.dms.jpa.repository.EndorsementSubTypeRepo;
import com.palmyralabs.dms.masterdata.model.EndorsementSubTypeModel;
import com.palmyralabs.dms.masterdata.model.EndorsementTypeModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EndorsementSubTypeService {

	private final EndorsementSubTypeRepo repository;
	
	public EndorsementSubTypeModel createEndorsementSubType(EndorsementSubTypeModel model) {
		EndorsementSubTypeEntity endorsementSubTypeEntity = new EndorsementSubTypeEntity();
	
		endorsementSubTypeEntity.setCode(model.getCode());
		endorsementSubTypeEntity.setDescription(model.getDescription());
		endorsementSubTypeEntity.setEndorsementType(toEntity(model.getEndorsementType()));
		endorsementSubTypeEntity.setName(model.getName());
		EndorsementSubTypeEntity savedEndorsementSubTypeEntity = repository.save(endorsementSubTypeEntity);
		return toModel(savedEndorsementSubTypeEntity);
	}


	public List<EndorsementSubTypeModel> getAll(Integer endorsementType) {
		List<EndorsementSubTypeEntity> entities = repository.findByEndorsementType_Id(endorsementType);
		List<EndorsementSubTypeModel> models = new ArrayList<>();

		for (EndorsementSubTypeEntity entity : entities) {
			models.add(toModel(entity));
		}
		return models;
	}

	public EndorsementSubTypeModel getById(Integer id) {
		Optional<EndorsementSubTypeEntity> entity = repository.findById(id);
		if (entity.isEmpty()) {
			throw new InvaidInputException("INV404", "Endorsement Sub Type not found");
		}
		return toModel(entity.get());
	}

	private EndorsementTypeEntity toEntity(EndorsementTypeModel model) {
		EndorsementTypeEntity entity = new EndorsementTypeEntity();
		entity.setId(model.getId());
		entity.setName(model.getName());
		entity.setCode(model.getCode());
		entity.setDescription(model.getDescription());
		return entity;
	}
	
	private EndorsementSubTypeModel toModel(EndorsementSubTypeEntity entity) {
		EndorsementSubTypeModel model = new EndorsementSubTypeModel();
		model.setId(entity.getId());
		model.setEndorsementType(toEndorsementModel(entity.getEndorsementType()));
		model.setName(entity.getName());
		model.setCode(entity.getCode());
		model.setDescription(entity.getDescription());
		return model;
	}
	
	  private EndorsementTypeModel toEndorsementModel(EndorsementTypeEntity entity) {
	        EndorsementTypeModel model = new EndorsementTypeModel();
	        model.setId(entity.getId());
	        model.setCode(entity.getCode());
	        model.setName(entity.getName());
	        model.setDescription(entity.getDescription());
	        return model;
	    }
}
