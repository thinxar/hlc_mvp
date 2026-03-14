package com.palmyralabs.dms.revival.service;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.entity.RevDocumentTypeEntity;
import com.palmyralabs.dms.revival.model.RevDocumentTypeModel;
import com.palmyralabs.dms.revival.repository.RevDocumentTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevDocumentTypeService {

	private final RevDocumentTypeRepository repository;

	public RevDocumentTypeModel createDocumentType(RevDocumentTypeModel model) {
		RevDocumentTypeEntity documentTypeEntity = new RevDocumentTypeEntity();
		documentTypeEntity.setCode(model.getCode());
		documentTypeEntity.setDescription(model.getDescription());
		documentTypeEntity.setDocument(model.getDocument());

		RevDocumentTypeEntity saveddocketTypeEntity = repository.save(documentTypeEntity);
		return toModel(saveddocketTypeEntity);
	}


	private RevDocumentTypeModel toModel(RevDocumentTypeEntity entity) {
		RevDocumentTypeModel model = new RevDocumentTypeModel();
		model.setId(entity.getId());
		model.setDocument(entity.getDocument());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		return model;
	}
}

