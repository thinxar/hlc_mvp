package com.palmyralabs.dms.policyBazaar.modelMapper;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.policyBazaar.entity.PbzDocumentTypeEntity;
import com.palmyralabs.dms.policyBazaar.entity.PbzPolicyEntity;
import com.palmyralabs.dms.policyBazaar.entity.PbzPolicyFileEntity;
import com.palmyralabs.dms.policyBazaar.model.PbzDocumentTypeModel;
import com.palmyralabs.dms.policyBazaar.model.PbzPolicyFileModel;
import com.palmyralabs.dms.policyBazaar.model.PbzPolicyModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PbzPolicyModelMapper {

	
	public PbzPolicyFileModel toPolicyFileModel(PbzPolicyFileEntity entity) {
		PbzPolicyFileModel model = new PbzPolicyFileModel();
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
	
	public PbzPolicyModel toPolicyModel(PbzPolicyEntity entity) {
		PbzPolicyModel model = new PbzPolicyModel();
		model.setId(entity.getId());
		model.setPolicyNumber(entity.getPolicyNumber());
		model.setBoCode(entity.getBoCode());
		model.setSoCode(entity.getSoCode());
		model.setAgentCode(entity.getAgentCode());
		model.setAckNo(entity.getAckNo());
		model.setLanName(entity.getLanName());
		model.setProposalType(entity.getProposalType());
		model.setProposalNo(entity.getProposalNo());
		model.setYear(entity.getYear());
		model.setPlanCode(entity.getPlanCode());
		model.setRequestTime(entity.getRequestTime());
		model.setProcessTime(entity.getProcessTime());
		return model;
	}
	
	private PbzDocumentTypeModel toDocketTypeModel(PbzDocumentTypeEntity entity) {
		PbzDocumentTypeModel model = new PbzDocumentTypeModel();
		model.setId(entity.getId());
		model.setDocument(entity.getDocument());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		return model;
	}
	
}