package com.palmyralabs.dms.ananda.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.ananda.entity.AndDocumentTypeEntity;
import com.palmyralabs.dms.ananda.entity.AndPolicyEntity;
import com.palmyralabs.dms.ananda.entity.AndPolicyFileEntity;
import com.palmyralabs.dms.ananda.model.AndPolicyFileModel;
import com.palmyralabs.dms.ananda.modelMapper.AndPolicyModelMapper;
import com.palmyralabs.dms.ananda.repository.AndDocumentTypeRepository;
import com.palmyralabs.dms.ananda.repository.AndPolicyFileRepository;
import com.palmyralabs.dms.ananda.repository.AndPolicyRepository;
import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.handler.PolicyFileUploadListener;
import com.palmyralabs.palmyra.base.exception.DataNotFoundException;
import com.palmyralabs.palmyra.s3.service.impl.SyncFileServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AndPolicyFileService {
	private final AndPolicyModelMapper modelMapper;
	private final MongoTemplate mongoTemplate;
	private final SyncFileServiceImpl syncFileService;
	private final AndDocumentTypeRepository docTypeRepo;
	private final AndPolicyRepository policyRepository;
	private final AndPolicyFileRepository policyFileRepository;

	
	public String upload(MultipartFile file, Integer policyId, Integer docketTypeId, boolean incrementalFileName) {
		log.info("Initiating upload process for policyId={}, docketTypeId={}", policyId, docketTypeId);
		Optional<AndPolicyEntity> policyOptional = policyRepository.findById(policyId);

		if (policyOptional.isPresent()) {
			AndPolicyEntity policy = policyOptional.get();
			String folder = String.valueOf(policy.getProposalNo()) + "/" + policy.getId();
			String objectUrl = String.join("/", folder, file.getOriginalFilename());

			String fileName = checkObjectUrlAlreadyExists(objectUrl, file, folder, docketTypeId, incrementalFileName);
			objectUrl = String.join("/", folder, fileName);
			PolicyFileUploadListener listener = new PolicyFileUploadListener();
			try {
				syncFileService.upload(folder, fileName, file, listener);
				log.info("Upload successful: File '{}' uploaded to '{}'", fileName, folder);
			} catch (Exception e) {
				log.error("S3 upload failed for file '{}': {}", fileName, e.getMessage(), e);
				throw new InvalidInputException("INV400", "File Upload To S3 failed for " + e.getMessage());
			}
			savePolicyFile(fileName, file, policyId, objectUrl, docketTypeId);
			return "completed";
		} else {
			throw new DataNotFoundException("INV012", "Policy Record not found");
		}
	}

	private void savePolicyFile(String fileName, MultipartFile file, Integer policyId, String objectUrl,
			Integer docketTypeId) {
		AndPolicyFileEntity fileEntity = new AndPolicyFileEntity();
		fileEntity.setFileName(fileName);
		fileEntity.setFileSize(file.getSize());
		fileEntity.setFileType(file.getContentType());
		fileEntity.setPolicyId(getPolicyEntity(policyId));
		fileEntity.setObjectUrl(objectUrl);
		fileEntity.setDocketType(getDocketType(docketTypeId));
		fileEntity.setCreatedOn(LocalDateTime.now());
		fileEntity.setCreatedBy("Admin");
		fileEntity.setActionBy("admin");
		fileEntity.setActionOn(LocalDateTime.now());
		policyFileRepository.save(fileEntity);
	}
	
	private boolean isEndorsement(Integer docketTypeId) {
		AndDocumentTypeEntity docEntity = getDocketType(docketTypeId);
		return docEntity.getCode().equals("115");
	}

	private String checkObjectUrlAlreadyExists(String objectUrl, MultipartFile file, String folder,
			Integer docketTypeId, boolean incrementalFileName) {

		Optional<AndPolicyFileEntity> optPolicyFile = policyFileRepository.findByObjectUrl(objectUrl);
		String fileName = file.getOriginalFilename();
		boolean isEndorsement = isEndorsement(docketTypeId) && incrementalFileName;

		if (optPolicyFile.isPresent()) {
			if (!isEndorsement) {
				throw new InvalidInputException("INV400", "File Already Exists");
			}

			String originalFileName = fileName;
			String extension = "";
			int dotIndex = originalFileName.lastIndexOf('.');
			if (dotIndex != -1) {
				fileName = originalFileName.substring(0, dotIndex);
				extension = originalFileName.substring(dotIndex);
			}
			int count = 1;
			String newFileName = "";
			do {
				newFileName = fileName + "_" + count + extension;
				count++;
				objectUrl = String.join("/", folder, newFileName);
				optPolicyFile = policyFileRepository.findByObjectUrl(objectUrl);
			} while (optPolicyFile.isPresent());
			return newFileName;
		}
		return fileName;

	}


	public List<AndPolicyFileModel> getAllPolicyFiles(String proposalNo, String soCode, String year) {
		Query query = new Query();
		if (proposalNo != null && !proposalNo.isBlank()) {
			query.addCriteria(Criteria.where("policyId.proposalNo").is(proposalNo));
		}
		if (soCode != null && !soCode.isBlank()) {
			query.addCriteria(Criteria.where("policyId.soCode").is(soCode));
		}
		if (year != null && !year.isBlank()) {
			query.addCriteria(Criteria.where("policyId.year").is(year));
		}
		List<AndPolicyFileEntity> result = mongoTemplate.find(query, AndPolicyFileEntity.class);
		List<AndPolicyFileModel> policyFileModels = new ArrayList<AndPolicyFileModel>();
		for (AndPolicyFileEntity entity : result) {
			policyFileModels.add(modelMapper.toPolicyFileModel(entity));
		}
		return policyFileModels;
	}
	
	private AndDocumentTypeEntity getDocketType(Integer id) {
		return docTypeRepo.findById(id)
				.orElseThrow(() -> new InvalidInputException("INV001", "docketType not found"));
	}
	
	private AndPolicyEntity getPolicyEntity(Integer id) {
		return policyRepository.findById(id)
				.orElseThrow(() -> new InvalidInputException("INV001", "policy record not found"));
	}

}
