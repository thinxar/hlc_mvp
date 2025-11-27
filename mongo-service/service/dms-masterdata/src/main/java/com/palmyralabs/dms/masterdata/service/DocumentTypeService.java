package com.palmyralabs.dms.masterdata.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.jpa.entity.DocumentTypeEntity;
import com.palmyralabs.dms.jpa.repository.DocumentTypeRepository;
import com.palmyralabs.dms.masterdata.model.DocumentTypeModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentTypeService {

	private final DocumentTypeRepository repository;

	public DocumentTypeModel createDocumentType(DocumentTypeModel model) {
		DocumentTypeEntity documentTypeEntity = new DocumentTypeEntity();
		documentTypeEntity.setCode(model.getCode());
		documentTypeEntity.setDescription(model.getDescription());
		documentTypeEntity.setDocument(model.getDocument());

		DocumentTypeEntity saveddocketTypeEntity = repository.save(documentTypeEntity);
		return toModel(saveddocketTypeEntity);
	}


	public List<DocumentTypeModel> getAll() {
		List<DocumentTypeEntity> entities = repository.findAll();
		List<DocumentTypeModel> models = new ArrayList<>();

		for (DocumentTypeEntity entity : entities) {
			models.add(toModel(entity));
		}
		return models;
	}

	public DocumentTypeModel getById(Integer id) {
		Optional<DocumentTypeEntity> entity = repository.findById(id);
		if (entity.isEmpty()) {
			throw new InvaidInputException("INV404", "Document type not found");
		}
		return toModel(entity.get());
	}

	private DocumentTypeModel toModel(DocumentTypeEntity entity) {
		DocumentTypeModel model = new DocumentTypeModel();
		model.setId(entity.getId());
		model.setDocument(entity.getDocument());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		return model;
	}
}

