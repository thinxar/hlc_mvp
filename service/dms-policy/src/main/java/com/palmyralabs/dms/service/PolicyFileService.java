package com.palmyralabs.dms.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

@Service
@RequiredArgsConstructor
public class PolicyFileService {
	private final AsyncFileService fileService;
	private final SyncFileServiceImpl syncFileService;
	private final PolicyFileRepository policyFileRepository;
	private final PolicyRepository policyRepository;

	public ResponseFileEmitter download(Integer policyId, Integer fileId) {
		PolicyFileEntity policyFileEntity = policyFileRepository.findByPolicyIdAndId(policyId, fileId);

		if (policyFileEntity != null) {
			if (policyFileEntity.getObjectUrl() != null) {
				ResponseFileEmitter emitter = new ResponseFileEmitter();
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

	public String upload(Integer policyId, MultipartFile file) {
		Optional<PolicyEntity> policyOptional = policyRepository.findById(policyId);

		if (policyOptional.isPresent()) {
			PolicyEntity policy = policyOptional.get();			
			String folder = String.valueOf(policy.getPolicyNumber());
			PolicyFileUploadListener listener = new PolicyFileUploadListener();
			
			syncFileService.upload(folder, file.getOriginalFilename(), file, listener);
			
			return "completed";
		} else {
			throw new DataNotFoundException("INV012", "Policy Record not found");
		}
	}

}
