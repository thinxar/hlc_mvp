package com.palmyralabs.dms.policyBazaar.modelMapper;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.policyBazaar.entity.PbzDocumentTypeEntity;
import com.palmyralabs.dms.policyBazaar.entity.PbzProposalEntity;
import com.palmyralabs.dms.policyBazaar.entity.PbzProposalFileEntity;
import com.palmyralabs.dms.policyBazaar.model.PbzDocumentTypeModel;
import com.palmyralabs.dms.policyBazaar.model.PbzProposalFileModel;
import com.palmyralabs.dms.policyBazaar.model.PbzProposalModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PbzProposalModelMapper {

	
	public PbzProposalFileModel toProposalFileModel(PbzProposalFileEntity entity) {
		PbzProposalFileModel model = new PbzProposalFileModel();
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
	
	public PbzProposalModel toPolicyModel(PbzProposalEntity entity) {
		PbzProposalModel model = new PbzProposalModel();
		model.setId(entity.getId());
		model.setPolicyNumber(entity.getPolicyNumber());
		model.setBoCode(entity.getBoCode());
		model.setAgentCode(entity.getAgentCode());
		model.setAckNo(entity.getAckNo());
		model.setLaName(entity.getLaName());
		model.setProposalType(entity.getProposalType());
		model.setProposalNo(entity.getProposalNo());
		model.setYear(entity.getYear());
		model.setDob(entity.getDob());
		model.setMobileNo(entity.getMobileNo());
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