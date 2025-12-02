package com.palmyralabs.dms.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.jpa.entity.DocumentTypeEntity;
import com.palmyralabs.dms.jpa.entity.FixedStampEntity;
import com.palmyralabs.dms.jpa.entity.PolicyEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileFixedStampEntity;
import com.palmyralabs.dms.jpa.repository.PolicyFileFixedStampRepo;
import com.palmyralabs.dms.jpa.repository.PolicyFileRepository;
import com.palmyralabs.dms.masterdata.model.DocumentTypeModel;
import com.palmyralabs.dms.masterdata.model.FixedStampModel;
import com.palmyralabs.dms.model.PolicyFileModel;
import com.palmyralabs.dms.model.PolicyModel;
import com.palmyralabs.dms.model.PolicyStampModel;
import com.palmyralabs.dms.model.PolicyStampPositionModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyFileService {

	private final PolicyFileRepository policyFileRepository;
	private final PolicyFileFixedStampRepo policyFileFixedStampRepo;
	private final ObjectMapper mapper;

	public List<PolicyFileModel> getAllPolicyFiles(Integer policyId) {
		List<PolicyFileEntity> policyFileEntities = policyFileRepository.findByPolicyId_IdOrderByDocketTypeAsc(policyId);
		List<PolicyFileModel> policyModels = new ArrayList<PolicyFileModel>();
		for (PolicyFileEntity entity : policyFileEntities) {
			policyModels.add(toModel(entity));
		}
		
		return policyModels;
	}
	
	public PolicyFileModel getById(Integer policyId,Integer id) {
	 PolicyFileEntity policyFileEntity=	policyFileRepository.findByPolicyId_IdAndId(policyId, id);
	 if(policyFileEntity!= null) {
		 return(toModel(policyFileEntity));
	 }
	 else {
		 throw new InvaidInputException("INV001", "file record not found");
	 }
	}

	private PolicyFileModel toModel(PolicyFileEntity entity) {

		PolicyFileModel model = new PolicyFileModel();
		model.setId(entity.getId());
		model.setPolicyId(toPolicyModel(entity.getPolicyId()));
		model.setFileName(entity.getFileName());
		model.setFileSize(entity.getFileSize());
		model.setFileType(entity.getFileType());
		model.setDocketType(toDocketTypeModel(entity.getDocketType()));
		model.setObjectUrl(entity.getObjectUrl());
		model.setCreatedOn(entity.getCreatedOn());
        model.setFixedStamp(getStamps(entity.getId()));
		return model;
	}
	
	private PolicyModel toPolicyModel(PolicyEntity entity) {
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
	
	private DocumentTypeModel toDocketTypeModel(DocumentTypeEntity entity) {
		DocumentTypeModel model = new DocumentTypeModel();
		model.setId(entity.getId());
		model.setDocument(entity.getDocument());
		model.setDescription(entity.getDescription());
		model.setCode(entity.getCode());
		return model;
	}
	
	private List<PolicyStampModel> getStamps(Integer policyFileId){
		List<PolicyFileFixedStampEntity> policyFileFixedStampEntities = policyFileFixedStampRepo.findBypolicyFile_id(policyFileId);
				
		List<PolicyStampModel> policyStampModels = new ArrayList<PolicyStampModel>();
		
		for(PolicyFileFixedStampEntity entity: policyFileFixedStampEntities) {
			PolicyStampModel policyStampModel = new PolicyStampModel();
			policyStampModel.setStamp(toStampModel(entity.getStamp()));
			policyStampModel.setCreatedOn(entity.getCreatedOn().toString());
		    try {
		    	PolicyStampPositionModel pos = mapper.readValue(entity.getPosition(), PolicyStampPositionModel.class);
		    	policyStampModel.setPosition(pos);
	        } catch (Exception e) {
	            policyStampModel.setPosition(null); 
	        }
			policyStampModels.add(policyStampModel);
		}
		return policyStampModels;
	}
	
	private FixedStampModel toStampModel(FixedStampEntity entity) {
		FixedStampModel model = new FixedStampModel();
		model.setId(entity.getId());
		model.setName(entity.getName());
		model.setCode(entity.getCode());
		model.setDescription(entity.getDescription());
		return model;
	}

}
