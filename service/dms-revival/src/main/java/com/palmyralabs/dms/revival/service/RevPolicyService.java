package com.palmyralabs.dms.revival.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.entity.RevPolicyEntity;
import com.palmyralabs.dms.revival.model.RevPolicyModel;
import com.palmyralabs.dms.revival.modelMapper.RevPolicyModelMapper;
import com.palmyralabs.dms.revival.repository.RevPolicyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevPolicyService {

	private final RevPolicyRepository revPolicyRepository;
	private final RevPolicyModelMapper modelMapper;

	public RevPolicyModel createPolicy(RevPolicyModel model) {
		RevPolicyEntity policyEntity = new RevPolicyEntity();
		Optional<RevPolicyEntity> dbPolicyOpt = revPolicyRepository.findByPolicyNumberAndSoCode(model.getPolicyNumber(),
				model.getSoCode());
		if (dbPolicyOpt.isPresent()) {
			policyEntity = dbPolicyOpt.get();
		}
		policyEntity.setPolicyNumber(model.getPolicyNumber());
		policyEntity.setBoCode(model.getBoCode());
		policyEntity.setAsrNo(model.getAsrNo());
		policyEntity.setDateOfSubmission(model.getDateOfSubmission());
		policyEntity.setDoCode(model.getDoCode());
		policyEntity.setDocSubType(model.getDocSubType());
		policyEntity.setDocType(model.getDocType());
		policyEntity.setSrNo(model.getSrNo());
		if (model.getSrNo() != null)
			policyEntity.setUploadedBy(model.getSrNo());
		policyEntity.setSoCode(model.getSoCode());
		RevPolicyEntity savedPolicyEntity = revPolicyRepository.save(policyEntity);
		return modelMapper.toPolicyModel(savedPolicyEntity);
	}
}
