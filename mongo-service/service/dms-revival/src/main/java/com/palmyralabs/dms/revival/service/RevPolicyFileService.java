package com.palmyralabs.dms.revival.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.jpa.entity.PolicyEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
import com.palmyralabs.dms.jpa.repository.PolicyFileRepository;
import com.palmyralabs.dms.jpa.repository.PolicyRepository;
import com.palmyralabs.dms.model.PolicyFileModel;
import com.palmyralabs.dms.modelMapper.PolicyModelMapper;
import com.palmyralabs.dms.revival.model.PolicyFileActionRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevPolicyFileService {
	private final PolicyRepository policyRepository;
	private final PolicyFileRepository policyFileRepository;
	private final PolicyModelMapper modelMapper;
	
	public List<PolicyFileModel>  updateDocumentStatus(PolicyFileActionRequest request) {

		PolicyEntity policy = policyRepository.findById(request.getPolicyId())
				.orElseThrow(() -> new InvalidInputException("INV001","Policy record not found"));

		String srNo = policy.getSrNo();
		List<PolicyFileEntity> files = policyFileRepository.findAllById(request.getFileIds());
		
		  if (files.size() != request.getFileIds().size()) {
		        throw new InvalidInputException("INV003","Some documents do not belong to the given policy");
		    }

		List<PolicyFileModel> policyFileModels = new ArrayList<PolicyFileModel>();
		for (PolicyFileEntity file : files) {
			file.setStatus(request.getStatus());
			file.setSrNo(srNo);
			file.setActionBy("admin");
			file.setActionOn(LocalDateTime.now());
			PolicyFileEntity savedPolicyFileEntity=policyFileRepository.save(file);
			policyFileModels.add(modelMapper.toPolicyFileModel(savedPolicyFileEntity));
		}
		
		return policyFileModels;
	}

}
