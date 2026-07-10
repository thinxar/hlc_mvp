package com.palmyralabs.dms.neft.service;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.neft.entity.NeftDocumentTypeEntity;
import com.palmyralabs.dms.neft.model.NeftDocumentTypeModel;
import com.palmyralabs.dms.neft.repository.NeftDocumentTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NeftDocumentTypeService {

	private final NeftDocumentTypeRepository repository;

	public NeftDocumentTypeModel createDocumentType(NeftDocumentTypeModel model) {
		NeftDocumentTypeEntity documentTypeEntity = new NeftDocumentTypeEntity();
		documentTypeEntity.setCode(model.getCode());
		documentTypeEntity.setDescription(model.getDescription());
		documentTypeEntity.setDocument(model.getDocument());

		NeftDocumentTypeEntity saveddocketTypeEntity = repository.save(documentTypeEntity);
		return toModel(saveddocketTypeEntity);
	}


	private NeftDocumentTypeModel toModel(NeftDocumentTypeEntity entity) {
		NeftDocumentTypeModel model = new NeftDocumentTypeModel();
		model.setId(entity.getId());
		model.setDocument(entity.getDocument());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		return model;
	}
}

