package com.palmyralabs.dms.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.handler.PolicyFileUploadListener;
import com.palmyralabs.dms.jpa.entity.DocumentTypeEntity;
import com.palmyralabs.dms.jpa.entity.FixedStampEntity;
import com.palmyralabs.dms.jpa.entity.PolicyEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileFixedStampEntity;
import com.palmyralabs.dms.jpa.repository.DocumentTypeRepository;
import com.palmyralabs.dms.jpa.repository.FixedStampRepo;
import com.palmyralabs.dms.jpa.repository.PolicyFileFixedStampRepo;
import com.palmyralabs.dms.jpa.repository.PolicyFileRepository;
import com.palmyralabs.dms.jpa.repository.PolicyRepository;
import com.palmyralabs.dms.masterdata.model.DocumentTypeModel;
import com.palmyralabs.dms.masterdata.model.FixedStampModel;
import com.palmyralabs.dms.model.PolicyFileFixedStampModel;
import com.palmyralabs.dms.model.PolicyFileModel;
import com.palmyralabs.dms.model.PolicyModel;
import com.palmyralabs.dms.model.PolicyStampRequest;
import com.palmyralabs.palmyra.base.exception.DataNotFoundException;
import com.palmyralabs.palmyra.filemgmt.common.MultipartFileSender;
import com.palmyralabs.palmyra.s3.service.impl.SyncFileServiceImpl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

	private final FixedStampRepo fixedStampRepo;
	private final PolicyRepository policyRepository;
	private final SyncFileServiceImpl syncFileService;
	private final PolicyFileRepository policyFileRepository;
	private final PolicyFileFixedStampRepo pFixedStampRepo;
	private final DocumentTypeRepository documentTypeRepository;
	private final String inputExtension = ".tif";

	public void download(HttpServletRequest request, HttpServletResponse response, String code) throws IOException {

		FixedStampEntity stampEntity = getFixedStampEntity(code);
		String stampName = stampEntity.getCode();

		String fileName = stampName + inputExtension;
		String startDir = System.getProperty("user.dir");
		String folderName = findParentFolderName(new File(startDir), fileName);
		String finalPath = folderName + "/" + fileName;
		ClassLoader classLoader = getClass().getClassLoader();

		try (InputStream is = classLoader.getResourceAsStream(finalPath)) {
			if (is == null) {
				throw new IOException("Stamp file " + fileName + " not found in classpath under " + folderName);
			}

			Path tempFile = Files.createTempFile(stampName, inputExtension);
			Files.copy(is, tempFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

			log.info("Serving stamp file {} from temp location {}", fileName, tempFile.toString());
			MultipartFileSender.fromPath(tempFile).setFileName(fileName).with(request).with(response).serveResource();
			response.setStatus(HttpStatus.FOUND.value());
			tempFile.toFile().deleteOnExit();
		} catch (IOException e) {
			log.error("Error while serving stamp file {}: {}", fileName, e.getMessage());
			response.setStatus(HttpStatus.NOT_FOUND.value());
			throw e;
		}
	}

	public List<PolicyFileFixedStampModel> upload(MultipartFile file, Integer policyId, Integer docketTypeId,
			PolicyStampRequest model) {

		log.info("Initiating upload process for policyId={}, docketTypeId={}", policyId, docketTypeId);
		Optional<PolicyEntity> policyOptional = policyRepository.findById(policyId);
		List<FixedStampModel> stampList = model.getStamp();

		if (policyOptional.isPresent()) {
			PolicyEntity policy = policyOptional.get();
			String folder = String.valueOf(policy.getPolicyNumber());
			String fileName = file.getOriginalFilename();
			String objectUrl= String.join("/",folder,file.getOriginalFilename());

			PolicyFileEntity policyFileEntity = getPolicyFileEntity(objectUrl);
			if (!policyFileEntity.getId().equals(model.getPolicyFileId())) {
				throw new InvaidInputException("INV001", "policyFileId not found");
			}
			if (stampList.size() == 0) {
				throw new InvaidInputException("INV001", "stamp is empty");
			}
			List<PolicyFileFixedStampModel> savedStamps = saveStampInfo(model);
			PolicyFileUploadListener listener = new PolicyFileUploadListener();
			try {
				syncFileService.upload(folder, fileName, file, listener);
				log.info("Upload successful: File '{}' uploaded to '{}'", fileName, folder);
			} catch (Exception e) {
				log.error("S3 upload failed for file '{}': {}", fileName, e.getMessage(), e);
				throw new InvaidInputException("INV400", "File Upload To S3 failed for " + e.getMessage());
			}
			updatePolicyFile(fileName, file, policyId, objectUrl, docketTypeId, policyFileEntity);
			
			return savedStamps;
		} else {
			throw new DataNotFoundException("INV012", "Policy Record not found");
		}
	}

	private void updatePolicyFile(String fileName, MultipartFile file, Integer policyId, String objectUrl,
			Integer docketTypeId, PolicyFileEntity fileEntity) {
		fileEntity.setFileName(fileName);
		fileEntity.setFileSize(file.getSize());
		fileEntity.setFileType(file.getContentType());
		fileEntity.setPolicyId((long) policyId);
		fileEntity.setObjectUrl(objectUrl);
		fileEntity.setDocketType((long) docketTypeId);
		policyFileRepository.save(fileEntity);
	}

	private List<PolicyFileFixedStampModel> saveStampInfo(PolicyStampRequest model) {
		List<FixedStampModel> stampList = model.getStamp();

		List<PolicyFileFixedStampEntity> policyStampEntities = new ArrayList<PolicyFileFixedStampEntity>();
		List<PolicyFileFixedStampModel> policyStampModels = new ArrayList<PolicyFileFixedStampModel>();

		for (FixedStampModel stamp : stampList) {
			policyStampEntities.add(savePolicyStamp(stamp, model));
		}
		List<PolicyFileFixedStampEntity> savedpolicyStampEntities = pFixedStampRepo.saveAll(policyStampEntities);
		for (PolicyFileFixedStampEntity entity : savedpolicyStampEntities) {
			policyStampModels.add(toModel(entity));
		}
		return policyStampModels;
	}

	private PolicyFileFixedStampEntity savePolicyStamp(FixedStampModel stamp, PolicyStampRequest model) {
		PolicyFileFixedStampEntity entity = new PolicyFileFixedStampEntity();
		Optional<PolicyFileFixedStampEntity>optPolicyStamp = getPolicyAndStampEntity(model.getPolicyFileId(),stamp.getId());
		if(optPolicyStamp.isPresent()) {
			throw new InvaidInputException("INV001", "stamp already attached for this file");
		}
		entity.setPolicyFile(model.getPolicyFileId());
		entity.setStamp(stamp.getId());
		return entity;
	}

	private PolicyFileFixedStampModel toModel(PolicyFileFixedStampEntity entity) {
		PolicyFileFixedStampModel model = new PolicyFileFixedStampModel();
		model.setId(entity.getId());
		model.setPolicyFile(toPolicyFileModel(entity.getPolicyFile()));
		model.setStamp(toStampModel(entity.getStamp()));
		model.setCreatedOn(entity.getTimestamps().getCreatedOn());
		return model;
	}

	private FixedStampModel toStampModel(Long id) {
		FixedStampEntity entity = getFixedStampEntity(id);
		FixedStampModel model = new FixedStampModel();
		model.setId(entity.getId());
		model.setCode(entity.getCode());
		model.setName(entity.getName());
		model.setDescription(entity.getDescription());
		return model;
	}

	private PolicyFileModel toPolicyFileModel(Long policyFileId) {
		PolicyFileEntity fileEntity = getPolicyFileEntity(policyFileId);
		PolicyFileModel model = new PolicyFileModel();
		model.setId(fileEntity.getId());
		model.setDocketType(toDocketTypeModel(fileEntity.getDocketType()));
		model.setFileName(fileEntity.getFileName());
		model.setFileSize(fileEntity.getFileSize());
		model.setFileType(fileEntity.getFileType());
		model.setObjectUrl(fileEntity.getObjectUrl());
		model.setPolicyId(toPolicyModel(fileEntity.getPolicyId()));
		model.setCreatedOn(fileEntity.getTimestamps().getCreatedOn());
		return model;
	}

	private DocumentTypeModel toDocketTypeModel(Long docketTypeId) {
		DocumentTypeEntity docketEntity = getDocumentTypeEntity(docketTypeId);
		DocumentTypeModel model = new DocumentTypeModel();
		model.setId(docketEntity.getId());
		model.setCode(docketEntity.getCode());
		model.setDocument(docketEntity.getDocument());
		model.setDescription(docketEntity.getDescription());
		return model;
	}

	private PolicyModel toPolicyModel(Long policyId) {
		PolicyEntity policyEntity = getPolicyEntity(policyId);
		PolicyModel model = new PolicyModel();
		model.setId(policyEntity.getId().intValue());
		model.setPolicyNumber(policyEntity.getPolicyNumber().intValue());
		model.setCustomerId(policyEntity.getCustomerId());
		model.setCustomerName(policyEntity.getCustomerName());
		model.setCustomerDob(policyEntity.getCustomerDob());
		model.setDoc(policyEntity.getDoc());
		model.setDivisionCode(policyEntity.getDivisionCode());
		model.setBranchCode(policyEntity.getBranchCode());
		model.setBatchNumber(policyEntity.getBatchNumber());
		model.setBoxNumber(policyEntity.getBoxNumber());
		model.setRmsStatus(policyEntity.getRmsStatus());
		model.setUploadLabel(policyEntity.getUploadLabel());
		model.setField1(policyEntity.getField1());
		model.setField2(policyEntity.getField2());
		model.setField3(policyEntity.getField3());
		model.setMobileNumber(policyEntity.getMobileNumber());
		model.setPolicyStatus(policyEntity.getPolicyStatus());
		return model;
	}

	public String findParentFolderName(File dir, String fileName) {
		File[] files = dir.listFiles();
		if (files == null)
			return null;

		for (File file : files) {
			if (file.isDirectory()) {
				String result = findParentFolderName(file, fileName);
				if (result != null)
					return result;
			} else if (file.getName().equalsIgnoreCase(fileName)) {
				return file.getParentFile().getName();
			}
		}
		return null;
	}

	private FixedStampEntity getFixedStampEntity(String code) {
		return fixedStampRepo.findByCode(code).orElseThrow(() -> new InvaidInputException("INV001", "stamp not found"));
	}

	private PolicyFileEntity getPolicyFileEntity(String objectUrl) {
		return policyFileRepository.findByObjectUrl(objectUrl)
				.orElseThrow(() -> new InvaidInputException("INV001", "PolicyFile not found"));
	}

	private FixedStampEntity getFixedStampEntity(Long id) {
		return fixedStampRepo.findById(id).orElseThrow(() -> new InvaidInputException("INV001", "stamp not found"));
	}

	private PolicyFileEntity getPolicyFileEntity(Long id) {
		return policyFileRepository.findById(id)
				.orElseThrow(() -> new InvaidInputException("INV001", "PolicyFile not found"));
	}

	private DocumentTypeEntity getDocumentTypeEntity(Long id) {
		return documentTypeRepository.findById(id)
				.orElseThrow(() -> new InvaidInputException("INV001", "docketType not found"));
	}

	private PolicyEntity getPolicyEntity(Long id) {
		return policyRepository.findById(id).orElseThrow(() -> new InvaidInputException("INV001", "policy not found"));
	}
	
	private Optional<PolicyFileFixedStampEntity> getPolicyAndStampEntity(Long policyId,Long stamp) {
		return pFixedStampRepo.findByPolicyFileAndStamp(policyId,stamp);
	}
	
	

}
