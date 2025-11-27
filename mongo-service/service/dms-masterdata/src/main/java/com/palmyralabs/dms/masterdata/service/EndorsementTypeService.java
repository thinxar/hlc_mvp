package com.palmyralabs.dms.masterdata.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.jpa.entity.EndorsementTypeEntity;
import com.palmyralabs.dms.jpa.repository.EndorsementTypeRepo;
import com.palmyralabs.dms.masterdata.model.EndorsementTypeModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EndorsementTypeService {

    private final EndorsementTypeRepo endorsementTypeRepository;
    
	public EndorsementTypeModel createEndorsementType(EndorsementTypeModel model) {
		EndorsementTypeEntity endorsementTypeEntity = new EndorsementTypeEntity();
	
		endorsementTypeEntity.setCode(model.getCode());
		endorsementTypeEntity.setDescription(model.getDescription());
		endorsementTypeEntity.setName(model.getName());
		EndorsementTypeEntity savedEndorsementTypeEntity = endorsementTypeRepository.save(endorsementTypeEntity);
		return toModel(savedEndorsementTypeEntity);
	}


    public List<EndorsementTypeModel> getAll() {
        List<EndorsementTypeEntity> entities = endorsementTypeRepository.findAll();
        List<EndorsementTypeModel> models = new ArrayList<>();

        for (EndorsementTypeEntity entity : entities) {
            models.add(toModel(entity));
        }

        return models;
    }

    public EndorsementTypeModel getById(Integer id) {
        Optional<EndorsementTypeEntity> entityOpt = endorsementTypeRepository.findById(id);

        if (entityOpt.isEmpty()) {
            throw new InvaidInputException("INV001", "Endorsement type not found");
        }

        return toModel(entityOpt.get());
    }

    private EndorsementTypeModel toModel(EndorsementTypeEntity entity) {
        EndorsementTypeModel model = new EndorsementTypeModel();
        model.setId(entity.getId());
        model.setCode(entity.getCode());
        model.setName(entity.getName());
        model.setDescription(entity.getDescription());
        return model;
    }
}

