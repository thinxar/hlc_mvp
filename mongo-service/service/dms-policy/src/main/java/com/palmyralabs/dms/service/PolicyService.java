package com.palmyralabs.dms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.jpa.entity.PolicyEntity;
import com.palmyralabs.dms.jpa.repository.PolicyRepository;
import com.palmyralabs.dms.model.PolicyModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyService {

	private final PolicyRepository policyRepository;

	public PolicyModel createPolicy(PolicyModel model) {
		PolicyEntity policyEntity = new PolicyEntity();
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
		return toModel(savedPolicyEntity);
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
	        policyModels.add(toModel(entity));
	    }

	    return policyModels;
	}


	public PolicyModel getById(Integer policyId) {
		Optional<PolicyEntity> policyEntity = policyRepository.findById(policyId);
		if (policyEntity.isEmpty()) {
			throw new InvaidInputException("INV001","policy record not found");
		}
		PolicyModel model = toModel(policyEntity.get());
		return model;
	}

	private PolicyModel toModel(PolicyEntity entity) {
		PolicyModel model = new PolicyModel();
		model.setId(entity.getId());
		model.setPolicyNumber(entity.getPolicyNumber());
		model.setCustomerId(entity.getCustomerId());
		model.setCustomerName(entity.getCustomerName());
		model.setCustomerDob(entity.getCustomerDob());
		model.setDoc(entity.getDoc());
		model.setDivisionCode(entity.getDivisionCode());
		model.setBranchCode(entity.getBranchCode());
		model.setBatchNumber(entity.getBatchNumber());
		model.setBoxNumber(entity.getBoxNumber());
		model.setRmsStatus(entity.getRmsStatus());
		model.setUploadLabel(entity.getUploadLabel());
		model.setField1(entity.getField1());
		model.setField2(entity.getField2());
		model.setField3(entity.getField3());
		model.setMobileNumber(entity.getMobileNumber());
		model.setPolicyStatus(entity.getPolicyStatus());
		return model;
	}

}
