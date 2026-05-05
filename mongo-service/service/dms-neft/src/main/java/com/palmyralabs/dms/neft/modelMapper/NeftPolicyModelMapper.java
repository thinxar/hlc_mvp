package com.palmyralabs.dms.neft.modelMapper;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.neft.entity.NeftDocumentTypeEntity;
import com.palmyralabs.dms.neft.entity.NeftPolicyEntity;
import com.palmyralabs.dms.neft.entity.NeftPolicyFileEntity;
import com.palmyralabs.dms.neft.model.NeftDocumentTypeModel;
import com.palmyralabs.dms.neft.model.NeftPolicyFileModel;
import com.palmyralabs.dms.neft.model.NeftPolicyModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NeftPolicyModelMapper {

	
	public NeftPolicyFileModel toPolicyFileModel(NeftPolicyFileEntity entity) {
		NeftPolicyFileModel model = new NeftPolicyFileModel();
		model.setId(entity.getId());
		model.setPolicyId(toPolicyModel(entity.getPolicyId()));
		model.setFileName(entity.getFileName());
		model.setFileSize(entity.getFileSize());
		model.setFileType(entity.getFileType());
		model.setDocketType(toDocketTypeModel(entity.getDocketType()));
		model.setObjectUrl(entity.getObjectUrl());
		model.setCreatedOn(entity.getCreatedOn());
		return model;
	}
	
	public NeftPolicyModel toPolicyModel(NeftPolicyEntity entity) {
		NeftPolicyModel model = new NeftPolicyModel();
		model.setId(entity.getId());
		model.setPolicyNumber(entity.getPolicyNumber());
		model.setUid(entity.getUid());
		model.setAdvReferenceNumber(entity.getAdvReferenceNumber());
		return model;
	}
	
	private NeftDocumentTypeModel toDocketTypeModel(NeftDocumentTypeEntity entity) {
		NeftDocumentTypeModel model = new NeftDocumentTypeModel();
		model.setId(entity.getId());
		model.setDocument(entity.getDocument());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		return model;
	}
	
}