package com.palmyralabs.dms.ananda.modelMapper;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.ananda.entity.AndDocumentTypeEntity;
import com.palmyralabs.dms.ananda.entity.AndProposalEntity;
import com.palmyralabs.dms.ananda.entity.AndProposalFileEntity;
import com.palmyralabs.dms.ananda.model.AndDocumentTypeModel;
import com.palmyralabs.dms.ananda.model.AndProposalFileModel;
import com.palmyralabs.dms.ananda.model.AndProposalModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AndPolicyModelMapper {

	
	public AndProposalFileModel toProposalFileModel(AndProposalFileEntity entity) {
		AndProposalFileModel model = new AndProposalFileModel();
		model.setId(entity.getId());
		model.setPolicyId(toProposalModel(entity.getPolicyId()));
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
	
	public AndProposalModel toProposalModel(AndProposalEntity entity) {
		AndProposalModel model = new AndProposalModel();
		model.setId(entity.getId());
		model.setPolicyNumber(entity.getPolicyNumber());
		model.setBoCode(entity.getBoCode());
		model.setAgentCode(entity.getAgentCode());
		model.setAckNo(entity.getAckNo());
		model.setLaName(entity.getLaName());
		model.setProposalType(entity.getProposalType());
		model.setProposalNo(entity.getProposalNo());
		model.setYear(entity.getYear());
		model.setObjectSubmittedOn(entity.getObjectSubmittedOn());
		model.setProcessTime(entity.getProcessTime());
		model.setRequestTime(entity.getRequestTime());
		model.setPlanCode(entity.getPlanCode());
		return model;
	}
	
	private AndDocumentTypeModel toDocketTypeModel(AndDocumentTypeEntity entity) {
		AndDocumentTypeModel model = new AndDocumentTypeModel();
		model.setId(entity.getId());
		model.setDocument(entity.getDocument());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		return model;
	}
	
}