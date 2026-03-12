package com.palmyralabs.dms.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
import com.palmyralabs.dms.jpa.repository.PolicyFileRepository;
import com.palmyralabs.dms.model.PolicyFileModel;
import com.palmyralabs.dms.modelMapper.PolicyModelMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyFileService {

	private final PolicyFileRepository policyFileRepository;
	private final PolicyModelMapper modelMapper;
	public List<PolicyFileModel> getAllPolicyFiles(Integer policyId) {
		List<PolicyFileEntity> policyFileEntities = policyFileRepository.findByPolicyId_IdOrderByDocketTypeAsc(policyId);
		List<PolicyFileModel> policyModels = new ArrayList<PolicyFileModel>();
		for (PolicyFileEntity entity : policyFileEntities) {
			policyModels.add(modelMapper.toPolicyFileModel(entity));
		}
		
		return policyModels;
	}
	
	public PolicyFileModel getById(Integer policyId,Integer id) {
	 PolicyFileEntity policyFileEntity=	policyFileRepository.findByPolicyId_IdAndId(policyId, id);
	 if(policyFileEntity!= null) {
		 return(modelMapper.toPolicyFileModel(policyFileEntity));
	 }
	 else {
		 throw new InvalidInputException("INV001", "file record not found");
	 }
	}

}
