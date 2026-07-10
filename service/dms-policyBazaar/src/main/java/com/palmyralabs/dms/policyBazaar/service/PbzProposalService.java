package com.palmyralabs.dms.policyBazaar.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.policyBazaar.entity.PbzProposalEntity;
import com.palmyralabs.dms.policyBazaar.model.PbzProposalModel;
import com.palmyralabs.dms.policyBazaar.modelMapper.PbzProposalModelMapper;
import com.palmyralabs.dms.policyBazaar.repository.PbzProposalRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PbzProposalService {

	private final PbzProposalRepository PbzPolicyRepository;
	private final PbzProposalModelMapper modelMapper;

	public PbzProposalModel createPolicy(PbzProposalModel model) {
		PbzProposalEntity policyEntity = new PbzProposalEntity();
		Optional<PbzProposalEntity> dbPolicyOpt = PbzPolicyRepository.findByProposalNoAndBoCode(model.getProposalNo(),
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

		PbzProposalEntity savedPolicyEntity = PbzPolicyRepository.save(policyEntity);
		return modelMapper.toPolicyModel(savedPolicyEntity);
	}

}
