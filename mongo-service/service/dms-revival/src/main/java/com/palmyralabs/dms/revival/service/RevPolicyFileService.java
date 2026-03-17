package com.palmyralabs.dms.revival.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.handler.PolicyFileUploadListener;
import com.palmyralabs.dms.revival.entity.RevDocumentTypeEntity;
import com.palmyralabs.dms.revival.entity.RevPolicyEntity;
import com.palmyralabs.dms.revival.entity.RevPolicyFileEntity;
import com.palmyralabs.dms.revival.model.PolicyFileActionRequest;
import com.palmyralabs.dms.revival.model.PolicyFileStatus;
import com.palmyralabs.dms.revival.model.RevPolicyFileModel;
import com.palmyralabs.dms.revival.modelMapper.RevPolicyModelMapper;
import com.palmyralabs.dms.revival.repository.RevDocumentTypeRepository;
import com.palmyralabs.dms.revival.repository.RevPolicyFileRepository;
import com.palmyralabs.dms.revival.repository.RevPolicyRepository;
import com.palmyralabs.palmyra.base.exception.DataNotFoundException;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.s3.service.AsyncFileService;
import com.palmyralabs.palmyra.s3.service.impl.SyncFileServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RevPolicyFileService {
	private final RevPolicyRepository policyRepository;
	private final SyncFileServiceImpl syncFileService;
	private final RevPolicyFileRepository policyFileRepository;
	private final MongoTemplate mongoTemplate;
	private final RevDocumentTypeRepository docTypeRepo;
	private final RevPolicyModelMapper modelMapper;
	private final AsyncFileService asyncFileService;

	
	public String upload(MultipartFile file, Integer policyId, Integer docketTypeId, boolean incrementalFileName) {
		log.info("Initiating upload process for policyId={}, docketTypeId={}", policyId, docketTypeId);
		Optional<RevPolicyEntity> policyOptional = policyRepository.findById(policyId);

		if (policyOptional.isPresent()) {
			RevPolicyEntity policy = policyOptional.get();
			String folder = String.valueOf(policy.getPolicyNumber()) + "/" + policy.getId();
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
	
	public ResponseFileEmitter download(Integer policyId, Integer fileId) {
		RevPolicyFileEntity policyFileEntity = policyFileRepository.findByPolicyId_IdAndId(policyId, fileId);

		if (policyFileEntity != null) {
			if (policyFileEntity.getObjectUrl() != null) {
				ResponseFileEmitter emitter = new ResponseFileEmitter(60 * 1000L);
				String key = policyFileEntity.getObjectUrl();
				asyncFileService.download(key, emitter);
				return emitter;
			} else {
				throw new DataNotFoundException("INV012", "Object url not found");
			}
		} else {
			throw new DataNotFoundException("INV012", "File record not found");
		}
	}

	private void savePolicyFile(String fileName, MultipartFile file, Integer policyId, String objectUrl,
			Integer docketTypeId) {
		RevPolicyFileEntity fileEntity = new RevPolicyFileEntity();
		fileEntity.setFileName(fileName);
		fileEntity.setFileSize(file.getSize());
		fileEntity.setFileType(file.getContentType());
		fileEntity.setPolicyId(getPolicyEntity(policyId));
		fileEntity.setObjectUrl(objectUrl);
		fileEntity.setDocketType(getDocketType(docketTypeId));
		fileEntity.setCreatedOn(LocalDateTime.now());
		fileEntity.setCreatedBy("Admin");
		fileEntity.setStatus(PolicyFileStatus.PENDING.getValue());
		fileEntity.setActionBy("admin");
		fileEntity.setActionOn(LocalDateTime.now());
		policyFileRepository.save(fileEntity);
	}
	
	private boolean isEndorsement(Integer docketTypeId) {
		RevDocumentTypeEntity docEntity = getDocketType(docketTypeId);
		return docEntity.getCode().equals("115");
	}

	private String checkObjectUrlAlreadyExists(String objectUrl, MultipartFile file, String folder,
			Integer docketTypeId, boolean incrementalFileName) {

		Optional<RevPolicyFileEntity> optPolicyFile = policyFileRepository.findByObjectUrl(objectUrl);
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

	public List<RevPolicyFileModel> updateDocumentStatus(PolicyFileActionRequest request) {
		policyRepository.findById(request.getPolicyId())
				.orElseThrow(() -> new InvalidInputException("INV001", "Policy record not found"));
		List<RevPolicyFileEntity> files = policyFileRepository.findAllById(request.getFileIds());
		if (files.size() != request.getFileIds().size()) {
			throw new InvalidInputException("INV003", "Some documents do not belong to the given policy");
		}
		List<RevPolicyFileModel> policyFileModels = new ArrayList<RevPolicyFileModel>();
		for (RevPolicyFileEntity file : files) {
			file.setStatus(request.getStatus());
			file.setActionBy("admin");
			file.setActionOn(LocalDateTime.now());
			RevPolicyFileEntity savedPolicyFileEntity = policyFileRepository.save(file);
			policyFileModels.add(modelMapper.toPolicyFileModel(savedPolicyFileEntity));
		}
		return policyFileModels;
	}

	public List<RevPolicyFileModel> getAllPolicyFiles(String policyNumber, String soCode, String srNo, String asrNo) {
		Query query = new Query();
		if (soCode != null && !soCode.isBlank()) {
			query.addCriteria(Criteria.where("policyId.soCode").is(soCode));
		}
		if (srNo != null && !srNo.isBlank()) {
			query.addCriteria(Criteria.where("policyId.srNo").is(srNo));
		}
		if (asrNo != null && !asrNo.isBlank()) {
			query.addCriteria(Criteria.where("policyId.asrNo").is(asrNo));
		}
		if (policyNumber != null && !policyNumber.isBlank()) {
		    query.addCriteria(
		        Criteria.where("policyId.policyNumber")
		        .is(Long.valueOf(policyNumber))
		    );
		}
		List<RevPolicyFileEntity> result = mongoTemplate.find(query, RevPolicyFileEntity.class);
		List<RevPolicyFileModel> policyFileModels = new ArrayList<RevPolicyFileModel>();
		for (RevPolicyFileEntity entity : result) {
			policyFileModels.add(modelMapper.toPolicyFileModel(entity));
		}

		return policyFileModels;
	}
	
	private RevDocumentTypeEntity getDocketType(Integer id) {
		return docTypeRepo.findById(id)
				.orElseThrow(() -> new InvalidInputException("INV001", "docketType not found"));
	}
	
	private RevPolicyEntity getPolicyEntity(Integer id) {
		return policyRepository.findById(id)
				.orElseThrow(() -> new InvalidInputException("INV001", "policy record not found"));
	}


}
