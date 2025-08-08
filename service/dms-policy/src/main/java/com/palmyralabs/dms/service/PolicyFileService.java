package com.palmyralabs.dms.service;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
import com.palmyralabs.dms.jpa.repository.PolicyFileRepository;
import com.palmyralabs.palmyra.base.exception.DataNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyFileService {
	
	private final PolicyFileRepository policyFileRepository;

	public String getKey(Integer policyId,Integer fileId) {
		PolicyFileEntity policyFileEntity =  policyFileRepository.findByPolicyIdAndId(policyId,fileId);
		if(policyFileEntity!=null) {
			if(policyFileEntity.getObjectUrl()!=null) {
				return policyFileEntity.getObjectUrl();
			}
			else {
				  throw new DataNotFoundException("INV012","Object URL not found");
			}
		}
		else {
			throw new DataNotFoundException("INV012","policy not found");
		}
	}
	
}
