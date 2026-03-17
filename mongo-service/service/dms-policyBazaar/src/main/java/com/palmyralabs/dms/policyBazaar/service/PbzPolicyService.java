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
		Optional<PbzPolicyEntity> dbPolicyOpt = PbzPolicyRepository.findByProposalNoAndSoCode(model.getProposalNo(),
				model.getSoCode());
		if(dbPolicyOpt.isPresent()) {
			policyEntity = dbPolicyOpt.get();
		}
		policyEntity.setPolicyNumber(model.getPolicyNumber());
		policyEntity.setBoCode(model.getBoCode());
		policyEntity.setAgentCode(model.getAgentCode());
		policyEntity.setSoCode(model.getSoCode());
		policyEntity.setAckNo(model.getAckNo());
		policyEntity.setLanName(model.getLanName());
		policyEntity.setProposalType(model.getProposalType());
		policyEntity.setProposalNo(model.getProposalNo());
		policyEntity.setYear(model.getYear());
		policyEntity.setPlanCode(model.getPlanCode());
		policyEntity.setRequestTime(model.getRequestTime());
		policyEntity.setProcessTime(model.getProcessTime());

		PbzPolicyEntity savedPolicyEntity = PbzPolicyRepository.save(policyEntity);
		return modelMapper.toPolicyModel(savedPolicyEntity);
	}

}
