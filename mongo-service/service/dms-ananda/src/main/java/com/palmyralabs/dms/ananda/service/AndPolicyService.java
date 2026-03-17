package com.palmyralabs.dms.ananda.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.ananda.entity.AndPolicyEntity;
import com.palmyralabs.dms.ananda.model.AndPolicyModel;
import com.palmyralabs.dms.ananda.modelMapper.AndPolicyModelMapper;
import com.palmyralabs.dms.ananda.repository.AndPolicyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AndPolicyService {

	private final AndPolicyRepository andPolicyRepository;
	private final AndPolicyModelMapper modelMapper;

	public AndPolicyModel createPolicy(AndPolicyModel model) {
		AndPolicyEntity policyEntity = new AndPolicyEntity();
		Optional<AndPolicyEntity> dbPolicyOpt = andPolicyRepository.findByProposalNoAndBoCode(model.getProposalNo(),
				model.getBoCode());
		if(dbPolicyOpt.isPresent()) {
			policyEntity = dbPolicyOpt.get();
		}
		policyEntity.setPolicyNumber(model.getPolicyNumber());
		policyEntity.setBoCode(model.getBoCode());
		policyEntity.setAgentCode(model.getAgentCode());
		policyEntity.setAckNo(model.getAckNo());
		policyEntity.setLaName(model.getLaName());
		policyEntity.setProposalType(model.getProposalType());
		policyEntity.setProposalNo(model.getProposalNo());
		policyEntity.setYear(model.getYear());
		policyEntity.setDob(model.getDob());
		policyEntity.setMobileNo(model.getMobileNo());

		AndPolicyEntity savedPolicyEntity = andPolicyRepository.save(policyEntity);
		return modelMapper.toPolicyModel(savedPolicyEntity);
	}

}
