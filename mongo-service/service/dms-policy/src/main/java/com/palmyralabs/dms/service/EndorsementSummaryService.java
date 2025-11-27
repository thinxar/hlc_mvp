package com.palmyralabs.dms.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
import com.palmyralabs.dms.jpa.repository.PolicyFileRepository;
import com.palmyralabs.dms.model.EndorsementSummaryModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EndorsementSummaryService {
	private final PolicyFileRepository policyFileRepository;

	public List<EndorsementSummaryModel> getEndorsementSummary(Integer policyId){
		List<EndorsementSummaryModel> summaryModels = new ArrayList<EndorsementSummaryModel>();
		List<PolicyFileEntity> policyFileEntities =policyFileRepository.findByPolicyId_IdAndDocketType_Id(policyId,15);
		for(PolicyFileEntity fileEntity :policyFileEntities) {
			summaryModels.add(toEndorsementSummaryModel(fileEntity));
		}
		
		return summaryModels;
	}
	
	private EndorsementSummaryModel toEndorsementSummaryModel(PolicyFileEntity fileEntity) {
		EndorsementSummaryModel model =  new EndorsementSummaryModel();
		model.setId(fileEntity.getId());
		model.setPolicyId(fileEntity.getPolicyId().getId());
		model.setFileType(fileEntity.getFileType());
		model.setFileName(fileEntity.getFileName());
		model.setCreatedOn(fileEntity.getCreatedOn());
		model.setCreatedBy(fileEntity.getCreatedBy());
		return model;
	}
}
