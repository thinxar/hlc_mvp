package com.palmyralabs.dms.ananda.service;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.ananda.entity.AndDocumentTypeEntity;
import com.palmyralabs.dms.ananda.model.AndDocumentTypeModel;
import com.palmyralabs.dms.ananda.repository.AndDocumentTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AndDocumentTypeService {

	private final AndDocumentTypeRepository repository;

	public AndDocumentTypeModel createDocumentType(AndDocumentTypeModel model) {
		AndDocumentTypeEntity documentTypeEntity = new AndDocumentTypeEntity();
		documentTypeEntity.setCode(model.getCode());
		documentTypeEntity.setDescription(model.getDescription());
		documentTypeEntity.setDocument(model.getDocument());

		AndDocumentTypeEntity saveddocketTypeEntity = repository.save(documentTypeEntity);
		return toModel(saveddocketTypeEntity);
	}


	private AndDocumentTypeModel toModel(AndDocumentTypeEntity entity) {
		AndDocumentTypeModel model = new AndDocumentTypeModel();
		model.setId(entity.getId());
		model.setDocument(entity.getDocument());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		return model;
	}
}
