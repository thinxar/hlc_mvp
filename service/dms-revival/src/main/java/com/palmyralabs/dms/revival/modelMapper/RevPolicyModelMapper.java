package com.palmyralabs.dms.revival.modelMapper;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.entity.RevDocumentTypeEntity;
import com.palmyralabs.dms.revival.entity.RevPolicyEntity;
import com.palmyralabs.dms.revival.entity.RevPolicyFileEntity;
import com.palmyralabs.dms.revival.model.RevDocumentTypeModel;
import com.palmyralabs.dms.revival.model.RevPolicyFileModel;
import com.palmyralabs.dms.revival.model.RevPolicyModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevPolicyModelMapper {

	
	public RevPolicyFileModel toPolicyFileModel(RevPolicyFileEntity entity) {
		RevPolicyFileModel model = new RevPolicyFileModel();
		model.setId(entity.getId());
		model.setPolicyId(toPolicyModel(entity.getPolicyId()));
		model.setFileName(entity.getFileName());
		model.setFileSize(entity.getFileSize());
		model.setFileType(entity.getFileType());
		model.setDocketType(toDocketTypeModel(entity.getDocketType()));
		model.setObjectUrl(entity.getObjectUrl());
		model.setCreatedOn(entity.getCreatedOn());
        model.setStatus(entity.getStatus());
        model.setActionBy(entity.getActionBy());
        model.setActionOn(entity.getActionOn());
		return model;
	}
	
	public RevPolicyModel toPolicyModel(RevPolicyEntity entity) {
		RevPolicyModel model = new RevPolicyModel();
		model.setId(entity.getId());
		model.setPolicyNumber(entity.getPolicyNumber());
		model.setBoCode(entity.getBoCode());
		model.setAsrNo(entity.getAsrNo());
		model.setDateOfSubmission(entity.getDateOfSubmission());
		model.setDoCode(entity.getDoCode());
		model.setDocSubType(entity.getDocSubType());
		model.setDocType(entity.getDocType());
		model.setSrNo(entity.getSrNo());
		model.setUploadedBy(entity.getUploadedBy());
		model.setSoCode(entity.getSoCode());
		return model;
	}
	
	private RevDocumentTypeModel toDocketTypeModel(RevDocumentTypeEntity entity) {
		RevDocumentTypeModel model = new RevDocumentTypeModel();
		model.setId(entity.getId());
		model.setDocument(entity.getDocument());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		return model;
	}
	
}