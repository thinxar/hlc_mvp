package com.palmyralabs.dms.policyBazaar.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.policyBazaar.entity.PbzPolicyEntity;
import com.palmyralabs.dms.policyBazaar.model.PbzPolicyModel;
import com.palmyralabs.dms.policyBazaar.modelMapper.PbzPolicyModelMapper;
import com.palmyralabs.dms.policyBazaar.repository.PbzPolicyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PbzPolicyService {

	private final PbzPolicyRepository PbzPolicyRepository;
	private final PbzPolicyModelMapper modelMapper;

	public PbzPolicyModel createPolicy(PbzPolicyModel model) {
		PbzPolicyEntity policyEntity = new PbzPolicyEntity();
		Optional<PbzPolicyEntity> dbPolicyOpt = PbzPolicyRepository.findByProposalNoAndBoCode(model.getProposalNo(),
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

		PbzPolicyEntity savedPolicyEntity = PbzPolicyRepository.save(policyEntity);
		return modelMapper.toPolicyModel(savedPolicyEntity);
	}

}
