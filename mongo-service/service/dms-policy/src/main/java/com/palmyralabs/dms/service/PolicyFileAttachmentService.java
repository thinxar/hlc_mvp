package com.palmyralabs.dms.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.handler.PolicyFileUploadListener;
import com.palmyralabs.dms.jpa.entity.DocumentTypeEntity;
import com.palmyralabs.dms.jpa.entity.PolicyEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
import com.palmyralabs.dms.jpa.repository.DocumentTypeRepository;
import com.palmyralabs.dms.jpa.repository.PolicyFileRepository;
import com.palmyralabs.dms.jpa.repository.PolicyRepository;
import com.palmyralabs.palmyra.base.exception.DataNotFoundException;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.s3.service.AsyncFileService;
import com.palmyralabs.palmyra.s3.service.impl.SyncFileServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PolicyFileAttachmentService {
	private final AsyncFileService fileService;
	private final SyncFileServiceImpl syncFileService;
	private final PolicyFileRepository policyFileRepository;
	private final PolicyRepository policyRepository;
	private final DocumentTypeRepository docTypeRepository;

	public ResponseFileEmitter download(Integer policyId, Integer fileId) {
		PolicyFileEntity policyFileEntity = policyFileRepository.findByPolicyId_IdAndId(policyId, fileId);

		if (policyFileEntity != null) {
			if (policyFileEntity.getObjectUrl() != null) {
				ResponseFileEmitter emitter = new ResponseFileEmitter(60 * 1000L);
				String key = policyFileEntity.getObjectUrl();
				fileService.download(key, emitter);
				return emitter;
			} else {
				throw new DataNotFoundException("INV012", "Object url not found");
			}
		} else {
			throw new DataNotFoundException("INV012", "File record not found");
		}
	}

	public String upload(MultipartFile file, Integer policyId, Integer docketTypeId, boolean incrementalFileName) {

		log.info("Initiating upload process for policyId={}, docketTypeId={}", policyId, docketTypeId);
		Optional<PolicyEntity> policyOptional = policyRepository.findById(policyId);

		if (policyOptional.isPresent()) {
			PolicyEntity policy = policyOptional.get();
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
				throw new InvaidInputException("INV400", "File Upload To S3 failed for " + e.getMessage());
			}
			savePolicyFile(fileName, file, policyId, objectUrl, docketTypeId);
			return "completed";
		} else {
			throw new DataNotFoundException("INV012", "Policy Record not found");
		}
	}

	private void savePolicyFile(String fileName, MultipartFile file, Integer policyId, String objectUrl,
			Integer docketTypeId) {
		PolicyFileEntity fileEntity = new PolicyFileEntity();
		fileEntity.setFileName(fileName);
		fileEntity.setFileSize(file.getSize());
		fileEntity.setFileType(file.getContentType());
		fileEntity.setPolicyId(getPolicyEntity(policyId));
		fileEntity.setObjectUrl(objectUrl);
		fileEntity.setDocketType(getDocketType(docketTypeId));
		fileEntity.setCreatedOn(LocalDateTime.now());
		fileEntity.setCreatedBy("Admin");
		policyFileRepository.save(fileEntity);
	}

	private boolean isEndorsement(Integer docketTypeId) {
		DocumentTypeEntity docEntity = getDocketType(docketTypeId);
		return docEntity.getCode().equals("115");
	}

	private String checkObjectUrlAlreadyExists(String objectUrl, MultipartFile file, String folder,
			Integer docketTypeId, boolean incrementalFileName) {

		Optional<PolicyFileEntity> optPolicyFile = policyFileRepository.findByObjectUrl(objectUrl);
		String fileName = file.getOriginalFilename();
		boolean isEndorsement = isEndorsement(docketTypeId) && incrementalFileName;

		if (optPolicyFile.isPresent()) {
			if (!isEndorsement) {
				throw new InvaidInputException("INV400", "File Already Exists");
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

	private DocumentTypeEntity getDocketType(Integer id) {
		return docTypeRepository.findById(id)
				.orElseThrow(() -> new InvaidInputException("INV001", "docketType not found"));
	}

	private PolicyEntity getPolicyEntity(Integer id) {
		return policyRepository.findById(id)
				.orElseThrow(() -> new InvaidInputException("INV001", "policy record not found"));
	}

}
