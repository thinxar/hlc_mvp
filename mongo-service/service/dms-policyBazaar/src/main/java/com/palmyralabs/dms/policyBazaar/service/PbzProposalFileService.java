package com.palmyralabs.dms.policyBazaar.service;

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
import com.palmyralabs.dms.policyBazaar.entity.PbzDocumentTypeEntity;
import com.palmyralabs.dms.policyBazaar.entity.PbzProposalEntity;
import com.palmyralabs.dms.policyBazaar.entity.PbzProposalFileEntity;
import com.palmyralabs.dms.policyBazaar.model.PbzProposalFileModel;
import com.palmyralabs.dms.policyBazaar.modelMapper.PbzProposalModelMapper;
import com.palmyralabs.dms.policyBazaar.repository.PbzDocumentTypeRepository;
import com.palmyralabs.dms.policyBazaar.repository.PbzProposalFileRepository;
import com.palmyralabs.dms.policyBazaar.repository.PbzProposalRepository;
import com.palmyralabs.palmyra.base.exception.DataNotFoundException;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.s3.service.AsyncFileService;
import com.palmyralabs.palmyra.s3.service.impl.SyncFileServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PbzProposalFileService {
	private final PbzProposalModelMapper modelMapper;
	private final MongoTemplate mongoTemplate;
	private final SyncFileServiceImpl syncFileService;
	private final PbzDocumentTypeRepository docTypeRepo;
	private final PbzProposalRepository ProposalRepository;
	private final PbzProposalFileRepository ProposalFileRepository;
	private final AsyncFileService asyncFileService;

	
	public String upload(MultipartFile file, Integer ProposalId, Integer docketTypeId, boolean incrementalFileName) {
		log.info("Initiating upload process for ProposalId={}, docketTypeId={}", ProposalId, docketTypeId);
		Optional<PbzProposalEntity> ProposalOptional = ProposalRepository.findById(ProposalId);

		if (ProposalOptional.isPresent()) {
			PbzProposalEntity Proposal = ProposalOptional.get();
			String folder = String.valueOf(Proposal.getProposalNo()) + "/" + Proposal.getId();
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
			saveProposalFile(fileName, file, ProposalId, objectUrl, docketTypeId);
			return "completed";
		} else {
			throw new DataNotFoundException("INV012", "Proposal Record not found");
		}
	}
	
	public ResponseFileEmitter download(Integer ProposalId, Integer fileId) {
		PbzProposalFileEntity ProposalFileEntity = ProposalFileRepository.findByPolicyId_IdAndId(ProposalId, fileId);

		if (ProposalFileEntity != null) {
			if (ProposalFileEntity.getObjectUrl() != null) {
				ResponseFileEmitter emitter = new ResponseFileEmitter(60 * 1000L);
				String key = ProposalFileEntity.getObjectUrl();
				asyncFileService.download(key, emitter);
				return emitter;
			} else {
				throw new DataNotFoundException("INV012", "Object url not found");
			}
		} else {
			throw new DataNotFoundException("INV012", "File record not found");
		}
	}

	private void saveProposalFile(String fileName, MultipartFile file, Integer ProposalId, String objectUrl,
			Integer docketTypeId) {
		PbzProposalFileEntity fileEntity = new PbzProposalFileEntity();
		fileEntity.setFileName(fileName);
		fileEntity.setFileSize(file.getSize());
		fileEntity.setFileType(file.getContentType());
		fileEntity.setPolicyId(getProposalEntity(ProposalId));
		fileEntity.setObjectUrl(objectUrl);
		fileEntity.setDocketType(getDocketType(docketTypeId));
		fileEntity.setCreatedOn(LocalDateTime.now());
		fileEntity.setCreatedBy("Admin");
		fileEntity.setActionBy("admin");
		fileEntity.setActionOn(LocalDateTime.now());
		ProposalFileRepository.save(fileEntity);
	}
	
	private boolean isEndorsement(Integer docketTypeId) {
		PbzDocumentTypeEntity docEntity = getDocketType(docketTypeId);
		return docEntity.getCode().equals("115");
	}

	private String checkObjectUrlAlreadyExists(String objectUrl, MultipartFile file, String folder,
			Integer docketTypeId, boolean incrementalFileName) {

		Optional<PbzProposalFileEntity> optProposalFile = ProposalFileRepository.findByObjectUrl(objectUrl);
		String fileName = file.getOriginalFilename();
		boolean isEndorsement = isEndorsement(docketTypeId) && incrementalFileName;

		if (optProposalFile.isPresent()) {
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
				optProposalFile = ProposalFileRepository.findByObjectUrl(objectUrl);
			} while (optProposalFile.isPresent());
			return newFileName;
		}
		return fileName;

	}


	public List<PbzProposalFileModel> getAllProposalFiles(String proposalNo, String boCode, String year) {
		Query query = new Query();
		if (proposalNo != null && !proposalNo.isBlank()) {
			query.addCriteria(Criteria.where("policyId.proposalNo").is(proposalNo));
		}
		if (boCode != null && !boCode.isBlank()) {
			query.addCriteria(Criteria.where("policyId.boCode").is(boCode));
		}
		if (year != null && !year.isBlank()) {
			query.addCriteria(Criteria.where("policyId.year").is(year));
		}
		List<PbzProposalFileEntity> result = mongoTemplate.find(query, PbzProposalFileEntity.class);
		List<PbzProposalFileModel> ProposalFileModels = new ArrayList<PbzProposalFileModel>();
		for (PbzProposalFileEntity entity : result) {
			ProposalFileModels.add(modelMapper.toProposalFileModel(entity));
		}
		return ProposalFileModels;
	}
	
	private PbzDocumentTypeEntity getDocketType(Integer id) {
		return docTypeRepo.findById(id)
				.orElseThrow(() -> new InvalidInputException("INV001", "docketType not found"));
	}
	
	private PbzProposalEntity getProposalEntity(Integer id) {
		return ProposalRepository.findById(id)
				.orElseThrow(() -> new InvalidInputException("INV001", "Proposal record not found"));
	}

}
