package com.palmyralabs.dms.neft.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.neft.entity.NeftPolicyEntity;
import com.palmyralabs.dms.neft.model.NeftPolicyModel;
import com.palmyralabs.dms.neft.modelMapper.NeftPolicyModelMapper;
import com.palmyralabs.dms.neft.repository.NeftPolicyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NeftPolicyService {

	private final NeftPolicyRepository policyRepository;
	private final NeftPolicyModelMapper modelMapper;
	
	public NeftPolicyModel createPolicy(NeftPolicyModel model) {
		NeftPolicyEntity neftPolicyEntity = new NeftPolicyEntity();
		neftPolicyEntity.setPolicyNumber(model.getPolicyNumber());
		neftPolicyEntity.setUid(model.getUid());
		neftPolicyEntity.setAdvReferenceNumber(model.getAdvReferenceNumber());
		NeftPolicyEntity savedNeftPolicyEntity = policyRepository.save(neftPolicyEntity);
		return modelMapper.toPolicyModel(savedNeftPolicyEntity);
	}

	public List<NeftPolicyModel> getAll(Long policyNumber) {
		List<NeftPolicyEntity> policyEntities;
		if (policyNumber != null) {
			policyEntities = policyRepository.findByPolicyNumber(policyNumber);
		} else {
			policyEntities = policyRepository.findAll();
		}
		List<NeftPolicyModel> NeftPolicyModels = new ArrayList<>();
		for (NeftPolicyEntity entity : policyEntities) {
			NeftPolicyModels.add(modelMapper.toPolicyModel(entity));
		}
		return NeftPolicyModels;
	}

	public NeftPolicyModel getById(Integer policyId) {
		Optional<NeftPolicyEntity> NeftPolicyEntity = policyRepository.findById(policyId);
		if (NeftPolicyEntity.isEmpty()) {
			throw new InvalidInputException("INV001", "policy record not found");
		}
		NeftPolicyModel model = modelMapper.toPolicyModel(NeftPolicyEntity.get());
		return model;
	}
}
