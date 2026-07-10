package com.palmyralabs.dms.ananda.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.ananda.entity.AndProposalEntity;
import com.palmyralabs.dms.ananda.model.AndProposalModel;
import com.palmyralabs.dms.ananda.modelMapper.AndPolicyModelMapper;
import com.palmyralabs.dms.ananda.repository.AndPolicyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AndProposalService {

	private final AndPolicyRepository andPolicyRepository;
	private final AndPolicyModelMapper modelMapper;

	public AndProposalModel createProposal(AndProposalModel model) {
		AndProposalEntity  policyEntity = new AndProposalEntity();
		Optional<AndProposalEntity> dbPolicyOpt = andPolicyRepository.findByProposalNoAndBoCode(model.getProposalNo(),
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
		policyEntity.setObjectSubmittedOn(model.getObjectSubmittedOn());
		policyEntity.setProcessTime(model.getProcessTime());
		policyEntity.setRequestTime(model.getRequestTime());
		policyEntity.setPlanCode(model.getPlanCode());

		AndProposalEntity savedPolicyEntity = andPolicyRepository.save(policyEntity);
		return modelMapper.toProposalModel(savedPolicyEntity);
	}

}
