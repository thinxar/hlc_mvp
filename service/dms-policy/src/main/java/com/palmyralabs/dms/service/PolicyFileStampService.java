package com.palmyralabs.dms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.jpa.entity.FixedStampEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileFixedStampEntity;
import com.palmyralabs.dms.jpa.repository.FixedStampRepo;
import com.palmyralabs.dms.jpa.repository.PolicyFileFixedStampRepo;
import com.palmyralabs.dms.jpa.repository.PolicyFileRepository;
import com.palmyralabs.dms.model.PolicyStampPositionModel;
import com.palmyralabs.dms.model.PolicyStampRequest;
import com.palmyralabs.palmyra.base.exception.DataNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PolicyFileStampService {

	private final PolicyFileRepository policyFileRepository;
	private final PolicyFileFixedStampRepo pFixedStampRepo;
	private final FixedStampRepo fixedStampRepo;
	private final ObjectMapper mapper;

	public String addStamp(PolicyStampRequest request) {

		long policyFileId = request.getPolicyFileId();
		Optional<PolicyFileEntity> policyFileOptional = policyFileRepository.findById(policyFileId);

		if (policyFileOptional.isPresent()) {
			PolicyFileEntity policyFileEntity = policyFileOptional.get();
			List<PolicyFileFixedStampEntity> policyFileFixedStampEntities = validateStampInfo(policyFileEntity,request);
			pFixedStampRepo.saveAll(policyFileFixedStampEntities);
			return "success";
		} else {
			throw new DataNotFoundException("INV012", "policy record not found");
		}
	}

	private List<PolicyFileFixedStampEntity> validateStampInfo(PolicyFileEntity policyFileEntity,
			PolicyStampRequest model) {
		List<PolicyStampPositionModel> stampList = model.getStamp();
		if (!policyFileEntity.getId().equals(model.getPolicyFileId())) {
			throw new InvaidInputException("INV001", "file record mismatch");
		}
		if (stampList.size() == 0) {
			throw new InvaidInputException("INV001", "stamp is empty");
		}
		List<PolicyFileFixedStampEntity> policyFileFixedStampEntities = new ArrayList<PolicyFileFixedStampEntity>();
		for (PolicyStampPositionModel stamp : stampList) {
			PolicyFileFixedStampEntity entity = new PolicyFileFixedStampEntity();
			Optional<FixedStampEntity> fixedStampOp = getStampEntity(stamp.getCode());
			if(fixedStampOp.isEmpty()) {
				throw new InvaidInputException("INV001", "stamp not found");
			}
			FixedStampEntity stampEntity = fixedStampOp.get();
			Optional<PolicyFileFixedStampEntity> optPolicyStamp = getPolicyAndStampEntity(model.getPolicyFileId(),
					stampEntity.getId());
			if (optPolicyStamp.isPresent()) {
				throw new InvaidInputException("INV001", "stamp already exists");
			}
			entity.setPolicyFile(model.getPolicyFileId());
			entity.setStamp(stampEntity.getId());
			entity.setPosition(getPosition(stamp));
			policyFileFixedStampEntities.add(entity);
		}
		return policyFileFixedStampEntities;
	}

	private String getPosition(PolicyStampPositionModel model) {
		ObjectWriter writer = mapper.writerFor(PolicyStampPositionModel.class);
		String position = "";
		try {
			position = writer.writeValueAsString(model);
		} catch (Exception e) {
			log.error("error while convert class {} to String", model, e.getMessage());
		}
		return position;
	}

	private Optional<PolicyFileFixedStampEntity> getPolicyAndStampEntity(Long policyFile, Long stamp) {
		return pFixedStampRepo.findByPolicyFileAndStamp(policyFile, stamp);
	}

	private Optional<FixedStampEntity> getStampEntity(String code) {
		return fixedStampRepo.findByCode(code);
	}
	
}
