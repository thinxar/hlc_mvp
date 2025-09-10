package com.palmyralabs.dms.service;

import java.nio.file.Paths;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.handler.PolicyFileUploadListener;
import com.palmyralabs.dms.jpa.entity.PolicyEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
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
public class PolicyFileService {
	private final AsyncFileService fileService;
	private final SyncFileServiceImpl syncFileService;
	private final PolicyFileRepository policyFileRepository;
	private final PolicyRepository policyRepository;
	private static final Logger logger = LoggerFactory.getLogger(PolicyFileService.class);
	  
	public ResponseFileEmitter download(Integer policyId, Integer fileId) {
		PolicyFileEntity policyFileEntity = policyFileRepository.findByPolicyIdAndId(policyId, fileId);

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

	public String upload(MultipartFile file, Integer policyId, Integer docketTypeId) {
		
		logger.info("Initiating upload process for policyId={}, docketTypeId={}", policyId, docketTypeId);
		Optional<PolicyEntity> policyOptional = policyRepository.findById(policyId);

		if (policyOptional.isPresent()) {
			PolicyEntity policy = policyOptional.get();
			String folder = String.valueOf(policy.getPolicyNumber());
			String objectUrl = Paths.get(folder, file.getOriginalFilename()).toString();

			String fileName = checkObjectUrlAlreadyExists(objectUrl, file, folder);
			objectUrl = Paths.get(folder, fileName).toString();
			PolicyFileUploadListener listener = new PolicyFileUploadListener();
			try {
				syncFileService.upload(folder, fileName, file, listener);
				logger.info("Upload successful: File '{}' uploaded to '{}'", fileName, folder);
			}catch(Exception e){
				logger.error("S3 upload failed for file '{}': {}", fileName, e.getMessage(),e);
				throw new InvaidInputException("INV400", "File Upload To S3 failed for "+e.getMessage());
			}	
			PolicyFileEntity fileEntity = new PolicyFileEntity();
			fileEntity.setFileName(fileName);
			fileEntity.setFileSize(file.getSize());
			fileEntity.setFileType(file.getContentType());
			fileEntity.setPolicyId((long) policyId);
			fileEntity.setObjectUrl(objectUrl);
			fileEntity.setDocketType((long) docketTypeId);
			policyFileRepository.save(fileEntity);

			return "completed";
		} else {
			throw new DataNotFoundException("INV012", "Policy Record not found");
		}
	}

	private String checkObjectUrlAlreadyExists(String objectUrl, MultipartFile file, String folder) {
		Optional<PolicyFileEntity> optPolicyFile = policyFileRepository.findByObjectUrl(objectUrl);
		String fileName = file.getOriginalFilename();
		if (optPolicyFile.isPresent()) {
			throw new InvaidInputException("INV400", "File Already Exists");
		} else {
			return fileName;
		}
	}

}
