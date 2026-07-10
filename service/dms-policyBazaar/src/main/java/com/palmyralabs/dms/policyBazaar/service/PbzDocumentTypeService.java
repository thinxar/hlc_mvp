package com.palmyralabs.dms.policyBazaar.service;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.policyBazaar.entity.PbzDocumentTypeEntity;
import com.palmyralabs.dms.policyBazaar.model.PbzDocumentTypeModel;
import com.palmyralabs.dms.policyBazaar.repository.PbzDocumentTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PbzDocumentTypeService {

	private final PbzDocumentTypeRepository repository;

	public PbzDocumentTypeModel createDocumentType(PbzDocumentTypeModel model) {
		PbzDocumentTypeEntity documentTypeEntity = new PbzDocumentTypeEntity();
		documentTypeEntity.setCode(model.getCode());
		documentTypeEntity.setDescription(model.getDescription());
		documentTypeEntity.setDocument(model.getDocument());

		PbzDocumentTypeEntity saveddocketTypeEntity = repository.save(documentTypeEntity);
		return toModel(saveddocketTypeEntity);
	}


	private PbzDocumentTypeModel toModel(PbzDocumentTypeEntity entity) {
		PbzDocumentTypeModel model = new PbzDocumentTypeModel();
		model.setId(entity.getId());
		model.setDocument(entity.getDocument());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		return model;
	}
}
