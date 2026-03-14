package com.palmyralabs.dms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.jpa.entity.PolicyEntity;
import com.palmyralabs.dms.jpa.repository.PolicyRepository;
import com.palmyralabs.dms.model.PolicyModel;
import com.palmyralabs.dms.modelMapper.PolicyModelMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyService {

	private final PolicyRepository policyRepository;
	private final PolicyModelMapper modelMapper;

	public PolicyModel createPolicy(PolicyModel model) {
		PolicyEntity policyEntity = new PolicyEntity();

		Optional<PolicyEntity> dbPolicyOpt = policyRepository.findByPolicyNumberAndBranchCode(model.getPolicyNumber(),
				model.getBranchCode());
		
		if(dbPolicyOpt.isPresent()) {
			policyEntity = dbPolicyOpt.get();
		}

		policyEntity.setPolicyNumber(model.getPolicyNumber());
		policyEntity.setCustomerId(model.getCustomerId());
		policyEntity.setCustomerName(model.getCustomerName());
		policyEntity.setCustomerDob(model.getCustomerDob());
		policyEntity.setDoc(model.getDoc());
		policyEntity.setDivisionCode(model.getDivisionCode());
		policyEntity.setBranchCode(model.getBranchCode());
		policyEntity.setBatchNumber(model.getBatchNumber());
		policyEntity.setBoxNumber(model.getBoxNumber());
		policyEntity.setRmsStatus(model.getRmsStatus());
		policyEntity.setUploadLabel(model.getUploadLabel());
		policyEntity.setField1(model.getField1());
		policyEntity.setField2(model.getField2());
		policyEntity.setField3(model.getField3());
		policyEntity.setMobileNumber(model.getMobileNumber());
		policyEntity.setPolicyStatus(model.getPolicyStatus());

		PolicyEntity savedPolicyEntity = policyRepository.save(policyEntity);
		return modelMapper.toPolicyModel(savedPolicyEntity);
	}

	public List<PolicyModel> getAll(Long policyNumber) {

		List<PolicyEntity> policyEntities;

		if (policyNumber != null) {
			policyEntities = policyRepository.findByPolicyNumber(policyNumber);
		} else {
			policyEntities = policyRepository.findAll();
		}

		List<PolicyModel> policyModels = new ArrayList<>();

		for (PolicyEntity entity : policyEntities) {
			policyModels.add(modelMapper.toPolicyModel(entity));
		}

		return policyModels;
	}

	public PolicyModel getById(Integer policyId) {
		Optional<PolicyEntity> policyEntity = policyRepository.findById(policyId);
		if (policyEntity.isEmpty()) {
			throw new InvalidInputException("INV001", "policy record not found");
		}
		PolicyModel model = modelMapper.toPolicyModel(policyEntity.get());
		return model;
	}

}
